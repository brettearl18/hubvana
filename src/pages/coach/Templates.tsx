import {
  Box,
  Button,
  Heading,
  Stack,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  SimpleGrid,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { CheckInTemplate, Question } from '../../types';

const Templates = () => {
  const { userProfile } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [templates, setTemplates] = useState<CheckInTemplate[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<CheckInTemplate | null>(null);
  const [newQuestion, setNewQuestion] = useState<Question>({
    id: '',
    type: 'text',
    label: '',
    required: false,
  });

  useEffect(() => {
    fetchTemplates();
  }, [userProfile]);

  const fetchTemplates = async () => {
    if (!userProfile) return;

    const templatesQuery = query(
      collection(db, 'templates'),
      where('createdBy', '==', userProfile.id)
    );
    const templatesSnapshot = await getDocs(templatesQuery);
    const templatesData = templatesSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as CheckInTemplate)
    );
    setTemplates(templatesData);
  };

  const handleCreateTemplate = async () => {
    if (!userProfile) return;

    try {
      const newTemplate: Omit<CheckInTemplate, 'id'> = {
        name: 'New Template',
        questions: [],
        createdBy: userProfile.id,
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await addDoc(collection(db, 'templates'), newTemplate);
      await fetchTemplates();
      toast({
        title: 'Template created',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error creating template',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await deleteDoc(doc(db, 'templates', templateId));
      await fetchTemplates();
      toast({
        title: 'Template deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error deleting template',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditTemplate = (template: CheckInTemplate) => {
    setCurrentTemplate(template);
    onOpen();
  };

  const handleAddQuestion = () => {
    if (!currentTemplate) return;

    const updatedTemplate = {
      ...currentTemplate,
      questions: [
        ...currentTemplate.questions,
        {
          ...newQuestion,
          id: Date.now().toString(),
        },
      ],
    };
    setCurrentTemplate(updatedTemplate);
    setNewQuestion({
      id: '',
      type: 'text',
      label: '',
      required: false,
    });
  };

  return (
    <Box>
      <Stack spacing={8}>
        <Box>
          <Heading mb={4}>Check-in Templates</Heading>
          <Text color="gray.600">Create and manage your check-in templates</Text>
        </Box>

        <Button
          leftIcon={<FiPlus />}
          colorScheme="brand"
          onClick={handleCreateTemplate}
          alignSelf="flex-start"
        >
          Create Template
        </Button>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <Heading size="md">{template.name}</Heading>
              </CardHeader>
              <CardBody>
                <Text color="gray.600">
                  {template.questions.length} questions
                </Text>
                <Text fontSize="sm" color="gray.500" mt={2}>
                  Created: {new Date(template.createdAt).toLocaleDateString()}
                </Text>
              </CardBody>
              <CardFooter>
                <HStack spacing={2}>
                  <IconButton
                    aria-label="Edit template"
                    icon={<FiEdit2 />}
                    onClick={() => handleEditTemplate(template)}
                  />
                  <IconButton
                    aria-label="Delete template"
                    icon={<FiTrash2 />}
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => handleDeleteTemplate(template.id)}
                  />
                </HStack>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Template</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Template Name</FormLabel>
                <Input
                  value={currentTemplate?.name || ''}
                  onChange={(e) =>
                    setCurrentTemplate(
                      currentTemplate
                        ? { ...currentTemplate, name: e.target.value }
                        : null
                    )
                  }
                />
              </FormControl>

              <Box w="full">
                <Heading size="sm" mb={4}>Questions</Heading>
                {currentTemplate?.questions.map((question, index) => (
                  <Card key={question.id} mb={4}>
                    <CardBody>
                      <Text fontWeight="bold">{question.label}</Text>
                      <Text color="gray.600">Type: {question.type}</Text>
                    </CardBody>
                  </Card>
                ))}
              </Box>

              <Box w="full" borderTop="1px" borderColor="gray.200" pt={4}>
                <Heading size="sm" mb={4}>Add New Question</Heading>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>Question Label</FormLabel>
                    <Input
                      value={newQuestion.label}
                      onChange={(e) =>
                        setNewQuestion({ ...newQuestion, label: e.target.value })
                      }
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Question Type</FormLabel>
                    <Select
                      value={newQuestion.type}
                      onChange={(e) =>
                        setNewQuestion({
                          ...newQuestion,
                          type: e.target.value as Question['type'],
                        })
                      }
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="slider">Slider</option>
                      <option value="radio">Radio</option>
                      <option value="checkbox">Checkbox</option>
                    </Select>
                  </FormControl>

                  <Button
                    leftIcon={<FiPlus />}
                    onClick={handleAddQuestion}
                    isDisabled={!newQuestion.label}
                  >
                    Add Question
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="brand">Save Template</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Templates; 