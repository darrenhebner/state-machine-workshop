import {
  Container,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Image,
  SimpleGrid,
  Spinner,
  FormControl,
  FormLabel,
  Alert,
  AlertDescription,
  AlertIcon,
  Center,
  AspectRatio,
  Skeleton,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import React, { FormEvent, useRef, useState } from "react";

// Helper types

type DogResponse =
  | { status: "success"; message: string[] }
  | { status: "error"; message: string };

interface FormElements extends HTMLFormControlsCollection {
  query: HTMLInputElement;
}

interface SearchForm extends HTMLFormElement {
  readonly elements: FormElements;
}

function App() {
  return (
    <Container>
      <form>
        <FormControl id="email" mt={8}>
          <FormLabel>Search for a breed</FormLabel>
          <InputGroup size="md">
            <Input name="query" autoComplete="off" variant="filled" />
            <InputRightElement>
              <IconButton
                type="submit"
                size="sm"
                aria-label="Search"
                icon={<SearchIcon />}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>
      </form>
    </Container>
  );
}

export default App;

// Copy pasta 🍝

// {error ? (
//   <Alert borderRadius="md" mt={4} status="error">
//     <AlertIcon />
//     <AlertDescription>{error}</AlertDescription>
//   </Alert>
// ) : null}

// {loading ? (
//   <Center my={8}>
//     <Spinner />
//   </Center>
// ) : null}

// {images ? (
//   <SimpleGrid
//     gridTemplateColumns="repeat(auto-fill, minmax(8rem, 1fr))"
//     gridAutoRows="1fr"
//     spacing={4}
//     mt={4}
//   >
//     {images.map((image) => (
//       <AspectRatio ratio={1}>
//         <Image
//           key={image}
//           src={image}
//           objectFit="cover"
//           borderRadius="md"
//           fallback={<Skeleton />}
//         />
//       </AspectRatio>
//     ))}
//   </SimpleGrid>
// ) : null}
