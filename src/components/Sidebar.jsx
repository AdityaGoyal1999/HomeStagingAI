// import { useState } from "react";
import { Box, VStack, useDisclosure} from "@chakra-ui/react";
// import { HamburgerIcon } from "@chakra-ui/icons";

export default function Sidebar() {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const isMobile = useBreakpointValue({ base: true, md: false });

  const sidebarContent = (
    <VStack align="start" spacing={6} p={6} w={{ base: "100vw", md: 60 }} h="100vh" bg="gray.200">
      <Box fontWeight="bold">Dashboard</Box>
      <Box>Profile</Box>
      <Box>Settings</Box>
      <Box>Logout</Box>
    </VStack>
  );

//   if (isMobile) {
//     return (
//       <>
//         <IconButton
//           icon={<HamburgerIcon />}
//           aria-label="Open menu"
//           onClick={onOpen}
//           position="fixed"
//           top={20}
//           left={4}
//           zIndex={120}
//         />
//         <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="full">
//           <DrawerOverlay />
//           <DrawerContent>
//             <DrawerCloseButton />
//             <DrawerBody p={0}>{sidebarContent}</DrawerBody>
//           </DrawerContent>
//         </Drawer>
//       </>
//     );
//   }

  return (
    <Box position="fixed" left={0} top={20} h="calc(100vh - 80px)" w={60} bg="gray.200" zIndex={110}>
      {sidebarContent}
    </Box>
  );
} 