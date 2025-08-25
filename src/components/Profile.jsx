import React from "react";
import { Box, Stack, Avatar, Heading, Text, SimpleGrid, Button } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { useOutletContext } from "react-router-dom";
import { handleLogout } from "../auth/authentication";

export default function Profile() {
  const { user } = useOutletContext();


  const displayName =
    user?.displayName || (user?.email ? user.email.split("@")[0] : "User");

  return (
    <Box>
        <Heading>Profile</Heading>
        <Box mt={8} display="flex" alignItems="center" gap={4} backgroundColor="white" p={4} borderRadius="md" py={8}>
            <Box mr={8}>
              <Avatar.Root width="150px" height="150px">
                  <Avatar.Fallback name={displayName} />
                  <Avatar.Image src={user?.photoURL || undefined} />
              </Avatar.Root>
            </Box>
            <Box>
              <Box>
                <Heading size="md">{displayName}</Heading>
                <Text color="gray.600">{user?.email || "—"}</Text>
              </Box>
              <Box>
                  <Text>Credits: {user?.credits}</Text>
              </Box>
            </Box>
        </Box>

        <Box>
          <Button mt={8} colorPalette="red" onClick={handleLogout}>Sign Out</Button>
        </Box>
        
    </Box>
  );
}