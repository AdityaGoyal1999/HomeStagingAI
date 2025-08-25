import React from "react";
import { Box, Stack, Avatar, Heading, Text } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { useOutletContext } from "react-router-dom";

export default function Profile() {
  const { user } = useOutletContext();


  const displayName =
    user?.displayName || (user?.email ? user.email.split("@")[0] : "User");

  return (
    <Box>
        <p>Profile</p>
        <Box>
            <Avatar.Root>
                <Avatar.Fallback name={displayName} />
                <Avatar.Image src={user?.photoURL || undefined} />
            </Avatar.Root>
        </Box>
        <Box>
            <Heading size="md">{displayName}</Heading>
            <Text color="gray.600">{user?.email || "—"}</Text>
        </Box>
        <Box>
            <Text>Credits: {user?.credits}</Text>
        </Box>
    </Box>
  );
}