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
import React, {
  FormEvent,
  useRef,
  useReducer,
  useEffect,
  Reducer,
} from "react";

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

// State machine types

type State =
  | { status: "idle"; results: string[] }
  | { status: "searching" }
  | { status: "error"; error: string };

type Action =
  | { type: "search"; query: string }
  | { type: "resolve"; results: string[] }
  | { type: "reject"; error: string };

type Effect = { type: "fetchDogs"; query: string };
type StateWithEffect = [State, Effect] | [State];

function reducer(current: StateWithEffect, action: Action): StateWithEffect {
  const [state] = current;

  switch (state.status) {
    case "idle": {
      if (action.type === "search") {
        return [
          { status: "searching" },
          { type: "fetchDogs", query: action.query },
        ];
      }
    }
    case "searching": {
      switch (action.type) {
        case "resolve": {
          return [{ status: "idle", results: action.results }];
        }
        case "reject": {
          return [{ status: "error", error: action.error }];
        }
      }
    }
    case "error": {
      if (action.type === "search") {
        return [
          { status: "searching" },
          { type: "fetchDogs", query: action.query },
        ];
      }
    }
    default: {
      console.warn(
        `Could not apply action (${action.type}) to current state (${state.status})`
      );
      return current;
    }
  }
}

function App() {
  const [current, dispatch] = useReducer<Reducer<StateWithEffect, Action>>(
    reducer,
    [
      {
        status: "idle",
        results: [],
      },
    ]
  );

  const [state, effect] = current;

  useEffect(() => {
    let cancelled = false;

    if (effect?.type === "fetchDogs") {
      fetch(`https://dog.ceo/api/breed/${effect.query}/images/random/8`)
        .then((body) => body.json())
        .then((data: DogResponse) => {
          if (cancelled) return;

          if (data.status === "success") {
            dispatch({ type: "resolve", results: data.message });
          } else {
            dispatch({ type: "reject", error: data.message });
          }
        })
        .catch((error) => {
          if (cancelled) return;
          dispatch({ type: "reject", error });
        });
    }

    () => {
      cancelled = true;
    };
  }, [effect]);

  function handleSearch(event: FormEvent<SearchForm>) {
    event.preventDefault();

    dispatch({
      type: "search",
      query: event.currentTarget.elements.query.value,
    });
  }

  return (
    <Container>
      <form onSubmit={handleSearch}>
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

      {state.status === "error" ? (
        <Alert borderRadius="md" mt={4} status="error">
          <AlertIcon />
          <AlertDescription>{state.error}</AlertDescription>/{" "}
        </Alert>
      ) : null}

      {state.status === "searching" ? (
        <Center my={8}>
          <Spinner />
        </Center>
      ) : null}

      {state.status === "idle" ? (
        <SimpleGrid
          gridTemplateColumns="repeat(auto-fill, minmax(8rem, 1fr))"
          gridAutoRows="1fr"
          spacing={4}
          mt={4}
        >
          {state.results.map((image) => (
            <AspectRatio ratio={1}>
              <Image
                key={image}
                src={image}
                objectFit="cover"
                borderRadius="md"
                fallback={<Skeleton key={image} />}
              />
            </AspectRatio>
          ))}
        </SimpleGrid>
      ) : null}
    </Container>
  );
}

export default App;
