import {
  Box,
  Button,
  Heading,
  Stack,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Radio,
  RadioGroup,
  Checkbox,
  VStack,
  useToast,
  Progress,
  Card,
  CardHeader,
  CardBody,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import useAuth from '../../hooks/useAuth';
import { CheckInTemplate, Question, QuestionResponse, CheckIn } from '../../types';

const CheckInPage = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [template, setTemplate] = useState<CheckInTemplate | null>(null);
  const [responses, setResponses] = useState<{ [key: string]: any }>({});
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchTemplate();
  }, [userProfile]);

  const fetchTemplate = async () => {
    if (!userProfile) return;

    try {
      const templatesQuery = query(
        collection(db, 'templates'),
        where('isDefault', '==', true)
      );
      const templatesSnapshot = await getDocs(templatesQuery);
      if (!templatesSnapshot.empty) {
        const templateData = {
          id: templatesSnapshot.docs[0].id,
          ...templatesSnapshot.docs[0].data(),
        } as CheckInTemplate;
        setTemplate(templateData);

        // Initialize responses
        const initialResponses: { [key: string]: any } = {};
        templateData.questions.forEach((question) => {
          initialResponses[question.id] = question.type === 'checkbox' ? false : '';
        });
        setResponses(initialResponses);
      }
    } catch (error) {
      toast({
        title: 'Error fetching template',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    // Update progress
    const answeredQuestions = Object.values(responses).filter(
      (response) => response !== '' && response !== false
    ).length;
    const totalQuestions = template?.questions.length || 0;
    setProgress((answeredQuestions / totalQuestions) * 100);
  };

  const handleSubmit = async () => {
    if (!userProfile || !template) return;

    try {
      const questionResponses: QuestionResponse[] = template.questions.map((question) => ({
        questionId: question.id,
        value: responses[question.id],
      }));

      const checkIn: Omit<CheckIn, 'id'> = {
        clientId: userProfile.id,
        coachId: '', // This should be set to the actual coach ID
        date: new Date(),
        status: 'completed',
        overallProgress: progress,
        responses: questionResponses,
      };

      await addDoc(collection(db, 'checkIns'), checkIn);

      toast({
        title: 'Check-in submitted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/client');
    } catch (error) {
      toast({
        title: 'Error submitting check-in',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'text':
        return (
          <Input
            value={responses[question.id] || ''}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={responses[question.id] || ''}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
          />
        );
      case 'slider':
        return (
          <Slider
            value={responses[question.id] || 0}
            onChange={(value) => handleResponseChange(question.id, value)}
            min={0}
            max={10}
            step={1}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        );
      case 'radio':
        return (
          <RadioGroup
            value={responses[question.id] || ''}
            onChange={(value) => handleResponseChange(question.id, value)}
          >
            <Stack direction="row">
              {question.options?.map((option) => (
                <Radio key={option} value={option}>
                  {option}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        );
      case 'checkbox':
        return (
          <Checkbox
            isChecked={responses[question.id] || false}
            onChange={(e) => handleResponseChange(question.id, e.target.checked)}
          >
            {question.label}
          </Checkbox>
        );
      default:
        return null;
    }
  };

  if (!template) {
    return (
      <Box>
        <Text>Loading template...</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Stack spacing={8}>
        <Box>
          <Heading mb={4}>Daily Check-in</Heading>
          <Text color="gray.600">Complete your daily check-in form</Text>
        </Box>

        <Progress value={progress} colorScheme="brand" rounded="md" />

        <Card>
          <CardHeader>
            <Heading size="md">{template.name}</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={6} align="stretch">
              {template.questions.map((question) => (
                <FormControl key={question.id} isRequired={question.required}>
                  <FormLabel>{question.label}</FormLabel>
                  {renderQuestion(question)}
                </FormControl>
              ))}
            </VStack>
          </CardBody>
        </Card>

        <Button
          colorScheme="brand"
          size="lg"
          onClick={handleSubmit}
          isDisabled={progress < 100}
        >
          Submit Check-in
        </Button>
      </Stack>
    </Box>
  );
};

export default CheckInPage; 