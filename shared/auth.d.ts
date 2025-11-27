declare module '#auth-utils' {
  interface User {
    id: number;
    username: string;
    role: "admin" | "player";
  }

  interface UserSession {
    // Add any additional session properties if needed
  }
}

export {};
