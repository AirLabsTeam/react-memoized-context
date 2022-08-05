<h1 align="center">React Memoized Context</h1>
<p align="center"><i>React Context with Redux-like performance and patterns without installing Redux.</i></p>

<p align="center">
  <a href="https://www.npmjs.com/package/@air/react-memoized-context">
    <img src="https://img.shields.io/npm/v/@air/react-memoized-context?color=2E77FF" alt="size" />
  </a>
</p>

## ✨ Features <a name="features"></a>

- Use your React Context without the additional re-renders in the consumers
- Ability to read values out of context "on-the-fly" - useful in callbacks so you don't have to bind the UI to a context value change just to use the value in a callback

## About
React Context is a comfortable tool to use as a React developer because it comes bundled with React. And it uses a familiar pattern that you as a React develop enjoy. The [downsides](https://blog.thoughtspile.tech/2021/10/04/react-context-dangers/) of React Context are known and this was our approach at Air to solve it. We've looked at [other solutions](https://github.com/dai-shi/use-context-selector) but they've had too many issues/lacked features (like reading values on the fly) so we decided to roll our own.

## Install

```bash
npm install --save @air/react-memoized-context
```

## Usage

Create a Context and Provider as usual:

```tsx
interface MyProviderProps {
  children: ReactNode;
}

interface MyContextType {
  name: string;
  age: number;
}

const MyContext = createContext<MyContextType>();

export const MyContextProvider = ({ children }: AnnotationProviderProps) => {

  const value: AnnotationContextType = useMemo(
    () => ({
      ...contextValue,
      setNewAnnotation,
      setActiveAnnotation,
      setAnnotationType,
      setAnnotationColor,
      setAnnotationSize,
      clearNewAnnotation,
      undo,
      setAnnotationsEnabled,
      redo,
      clearRevertedLines,
      addRevertedLine,
    }),
    [
      addRevertedLine,
      clearNewAnnotation,
      clearRevertedLines,
      contextValue,
      redo,
      setActiveAnnotation,
      setAnnotationColor,
      setAnnotationSize,
      setAnnotationType,
      setAnnotationsEnabled,
      setNewAnnotation,
      undo,
    ],
  );

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};
```