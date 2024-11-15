// app/layout.jsx
import "./globals.css";

export const metadata = {
  title: "Chatbot App",
  description: "A simple chatbot in Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
