import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Select,
  Alert,
  AlertIcon,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { useQueryClient } from '@tanstack/react-query';
import { useSupabaseAuth } from '../../integrations/supabase/auth';
import { ROLES } from '../../constants/roles';
import { useUsers, useUpdateUser, useDeleteUser } from '../../integrations/supabase/hooks/users';

const UserManagement = ({ showNotification, userRole }) => {
  const queryClient = useQueryClient();
  const { session } = useSupabaseAuth();
  const { data: users, isLoading, error } = useUsers();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const handleRoleChange = (userId, newRole) => {
    updateUserMutation.mutate({ id: userId, role: newRole }, {
      onSuccess: () => {
        showNotification('User Updated', 'The user role has been updated successfully.', 'success');
      },
      onError: (error) => {
        showNotification('Update Failed', `Failed to update user role: ${error.message}`, 'error');
      }
    });
  };

  const handleDeleteUser = (userId) => {
    onOpen();
    // Store the userId to be deleted when confirmed
    handleDeleteUser.userId = userId;
  };

  const confirmDelete = () => {
    const userId = handleDeleteUser.userId;
    deleteUserMutation.mutate(userId, {
      onSuccess: () => {
        showNotification('User Deleted', 'The user has been deleted successfully.', 'success');
        onClose();
      },
      onError: (error) => {
        showNotification('Delete Failed', `Failed to delete user: ${error.message}`, 'error');
        onClose();
      }
    });
  };

  if (isLoading) return <Box>Loading users...</Box>;
  if (error) return <Box>Error loading users: {error.message}</Box>;

  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>User Management</Heading>
      {!Array.isArray(users) ? (
        <Alert status="error">
          <AlertIcon />
          Error: User data is not in the expected format. Please contact support.
        </Alert>
      ) : users.length === 0 ? (
        <Alert status="info">
          <AlertIcon />
          No users found.
        </Alert>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>{user.id}</Td>
                <Td>{user.email}</Td>
                <Td>
                  <Select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    isDisabled={userRole !== ROLES.SUPER_ADMIN || user.id === session?.user?.id}
                  >
                    <option value={ROLES.USER}>User</option>
                    <option value={ROLES.ADMIN}>Admin</option>
                    <option value={ROLES.SUPER_ADMIN}>Super Admin</option>
                  </Select>
                </Td>
                <Td>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                    isDisabled={user.id === session?.user?.id}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete User
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this user? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default UserManagement;
