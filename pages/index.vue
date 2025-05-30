<script lang="ts">
export const description
  = 'A sign up form with first name, last name, email and password inside a card. There\'s an option to sign up with GitHub and a link to login if you already have an account'
export const iframeHeight = '600px'
// export const containerClass = 'w-full h-screen flex items-center justify-center px-4'
</script>

<template>
  <div class="containerCard">
    <Card class="mx-auto w-sm max-sm:w-full">
    <CardHeader>
      <CardTitle class="text-xl font-bold">
        Sign Up
      </CardTitle>
      <CardDescription>
        Enter your information to create an account
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid gap-4">
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="first-name">Full Name</Label>
            <Input id="first-name" placeholder="Max Doe" required />
          </div>
        </div>
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div class="grid gap-2">
          <Label for="password">Password</Label>
          <Input id="password" type="password" />
        </div>
        <Button type="submit" class="w-full">
          Create an account
        </Button>
      </div>
      <div class="mt-4 text-center text-sm">
        Already have an account?
        <a href="#" class="underline">
          Login
        </a>
      </div>
    </CardContent>
  </Card>
  </div>
</template>
