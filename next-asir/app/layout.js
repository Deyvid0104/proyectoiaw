export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <title>TechStore - Tu tienda de informática</title>
        <meta name="description" content="Tienda de productos informáticos y tecnología" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
