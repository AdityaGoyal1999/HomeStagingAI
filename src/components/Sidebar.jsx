import React, { useState } from "react";
import { Box, Flex, VStack, Text, IconButton, Avatar, Button } from "@chakra-ui/react";
import { handleLogout } from "../auth/authentication";
import { FiHome, FiImage, FiUser, FiSettings, FiCreditCard } from "react-icons/fi";
import { MdExitToApp } from "react-icons/md";
import { useNavigate } from "react-router-dom";
// import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
// Icons removed

const navItems = [
  { label: "Dashboard", icon: FiHome, path: "/home" },
  // { label: "Photos", icon: FiImage, path: "/photo" },
  { label: "Profile", icon: FiUser, path: "/home/profile" },
  { label: "Settings", icon: FiSettings, path: "/home/settings" },
  { label: "Payment History", icon: FiCreditCard, path: "/home/paymentHistory" },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapse = () => setIsCollapsed((prev) => !prev);
  const user = useAuth();
  const navigate = useNavigate();

  // const user = auth.currentUser;
  return (
    <Flex
      direction="column"
      justify="space-between"
      align="center"
      // bg="rgba(255,255,255,0.2)"
      backgroundColor="white"
      boxShadow="xl"
      width={isCollapsed ? "60px" : { base: "60px", md: "220px" }}
      position="fixed"
      height="97vh"
      left={0}
      top={0}
      zIndex={110}
      py={6}
      px={2}
      border="0.5px solid rgba(255,255,255,0.3)"
      sx={{
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderRight: "1px solid rgba(255,255,255,0.3)"
      }}
      m={4}
      borderRadius="2xl"
    >
      {/* Top: Logo/App Name */}
      <Box 
        mb={8} 
        w="full" 
        textAlign="center" 
        // cursor="pointer" 
        // onClick={handleCollapse}
        >
        <Text
          fontWeight="bold"
          fontSize="2xl"
          color="blue.500"
          letterSpacing="wide"
          display={isCollapsed ? "none" : { base: "none", md: "block" }}
        >
          HomeStaging AI
        </Text>
        <Text
          fontWeight="bold"
          fontSize="2xl"
          color="blue.500"
          letterSpacing="wide"
          display={isCollapsed ? "block" : { base: "block", md: "none" }}
        >
          HS
        </Text>
      </Box>

      {/* Middle: Navigation */}
      <VStack spacing={4} align="stretch" w="full" flex={1}>
        {navItems.map((item) => (
          <Flex
            key={item.label}
            align="center"
            px={2}
            py={2}
            borderRadius="md"
            _hover={{ bg: "blue.50", color: "blue.600", cursor: "pointer" }}
            onClick={() => navigate(item.path)}
            transition="background 0.2s"
            gap={3}
            justify={{ base: "center", md: "flex-start" }}
          >
            <Box as={item.icon} fontSize="xl" />
            <Text
              fontWeight="medium"
              display={isCollapsed ? "none" : { base: "none", md: "block" }}
            >
              {item.label}
            </Text>
          </Flex>
        ))}
      </VStack>

      {/* Divider replacement */}
      <Box borderTop="1px solid #e2e8f0" my={4} width="100%" />

      {/* Bottom: User Info */}
      <Flex direction="row" align="center" w="full" mb={2} justify="space-between" px={2}>
        {/* <Avatar size="md" name="User Name" src="" mb={2} /> */}
        <Box overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
          <Text fontSize="sm" fontWeight="semibold" display={{ base: "none", md: "block" }} overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
            {user.user.email}
          </Text>
          {/* <Text fontSize="sm" fontWeight="semibold" display={{ base: "none", md: "block" }} overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
            Credits: {user.user.credits}
          </Text> */}
        </Box>
        {/* <Button size="sm" onClick={handleLogout}>
          Logout
        </Button> */}
        <IconButton backgroundColor="white" color="black" onClick={handleLogout}>
          <MdExitToApp />
        </IconButton>
      </Flex>
    </Flex>
  );
} 