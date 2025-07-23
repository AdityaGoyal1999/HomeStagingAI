// import { useState } from "react";
import { Box, VStack, Button, Drawer, Portal } from "@chakra-ui/react";
import { CloseButton } from "@chakra-ui/react";
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
    <Drawer.Root placement="start">
      <Drawer.Trigger asChild>
        <Button variant="outline" size="sm">
          Open Drawer
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Drawer Title</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </Drawer.Footer>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
} 