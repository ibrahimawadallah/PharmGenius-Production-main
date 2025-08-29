import React from 'react';
import { Heading, Text, VStack, Divider } from '@chakra-ui/react';
import { Button as UiButton } from './ui/button';

const UiDemo = () => {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <Heading as="h1" size="lg" className="mb-2">UI Demo</Heading>
        <Text className="text-muted-foreground">Tailwind + shadcn/ui working alongside Chakra UI</Text>

        <Divider my={6} />

        <VStack align="start" spacing={4}>
          <Text fontWeight="bold">shadcn/ui Buttons</Text>
          <div className="flex flex-wrap gap-3">
            <UiButton>Default</UiButton>
            <UiButton variant="secondary">Secondary</UiButton>
            <UiButton variant="outline">Outline</UiButton>
            <UiButton variant="ghost">Ghost</UiButton>
            <UiButton variant="link">Link</UiButton>
            <UiButton size="sm">Small</UiButton>
            <UiButton size="lg">Large</UiButton>
          </div>

          <Divider />

          <Text fontWeight="bold">Tailwind-only Surface</Text>
          <div className="rounded-md bg-muted p-4 text-sm text-muted-foreground">
            This box uses Tailwind tokens (muted, foreground) from CSS variables.
          </div>

          <Text fontWeight="bold">Tailwind Typography Example</Text>
          <div className="prose prose-sm dark:prose-invert">
            <h3>Typography with Tailwind</h3>
            <p>
              You can now use utility classes directly in your JSX. The theme tokens
              are powered by CSS variables defined in src/index.css.
            </p>
          </div>
        </VStack>
      </div>
    </div>
  );
};

export default UiDemo;