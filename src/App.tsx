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
  const [images, setImages] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentQueryIdRef = useRef(0);

  function handleSubmit(event: FormEvent<SearchForm>) {
    event.preventDefault();
    const query = event.currentTarget.elements.query.value;

    const currentQueryId = currentQueryIdRef.current + 1;
    currentQueryIdRef.current = currentQueryId;

    setLoading(true);
    setError(null);
    setImages([]);

    fetch(`https://dog.ceo/api/breed/${query}/images/random/8`)
      .then((body) => body.json())
      .then((data: DogResponse) => {
        if (currentQueryIdRef.current !== currentQueryId) return;

        if (data.status === "success") {
          setImages(data.message);
        } else {
          setError(data.message);
        }
      })
      .catch((error) => {
        if (currentQueryIdRef.current !== currentQueryId) return;
        setError(error);
      })
      .finally(() => setLoading(false));
  }

  return (
    <Container>
      <form onSubmit={handleSubmit}>
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

      {error ? (
        <Alert borderRadius="md" mt={4} status="error">
          <AlertIcon />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {loading ? (
        <Center my={8}>
          <Spinner />
        </Center>
      ) : null}

      {images ? (
        <SimpleGrid
          gridTemplateColumns="repeat(auto-fill, minmax(8rem, 1fr))"
          gridAutoRows="1fr"
          spacing={4}
          mt={4}
        >
          {images.map((image) => (
            <AspectRatio ratio={1}>
              <Image
                key={image}
                src={image}
                objectFit="cover"
                borderRadius="md"
                fallback={<Skeleton />}
              />
            </AspectRatio>
          ))}
        </SimpleGrid>
      ) : null}
    </Container>
  );
}

export default App;
