import { Image, RefreshControl, StyleSheet } from "react-native";
import React from "react";
import { Container, ScrollView, Text } from "../components/Themed";
import { theme } from "../constants/Theme";
import { UvaCoins } from "../components/Uva.Coins";
import { backend } from "../constants/Backend";
import { Loader } from "../components/Loader";
import { useAppContext } from "../App.Provider";
import { errorColor } from "../constants/Colors";

type product = {
  id: number;
  nombre: string;
  cantidad: number;
  precio: number;
  imagen: string;
};

export function StoreProductsScreen() {
  const appContext = useAppContext();

  const [products, setProducts] = React.useState<product[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await backend.post(
        "/pos/get_productos/",
        { campo: appContext.user.location },
        {
          headers: {
            Authorization: `Bearer ${appContext.user.token.access}`,
          },
        }
      );
      setProducts([...res.data]);
    } catch (error) {}
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={fetchProducts} />
      }
    >
      {isLoading && <Loader />}
      {products.map((product) => (
        <Container key={product.nombre} style={styles.productContainer}>
          <Image
            resizeMode="contain"
            source={{
              uri: product.imagen,
            }}
            style={styles.image}
          />
          <Text style={{ fontWeight: "bold" }}>{product.nombre}</Text>
          <UvaCoins isSmall={true} points={product.precio} />
          <Text
            style={[
              { position: "absolute", left: 10, top: 10 },
              product.cantidad === 0 && {
                color: errorColor,
                fontWeight: "bold",
              },
            ]}
          >
            {product.cantidad > 0
              ? `Disponibles: ${product.cantidad}`
              : "Agotado"}
          </Text>
        </Container>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 180,
    height: 150,
    marginVertical: 10,
  },
  productContainer: {
    marginHorizontal: theme.marginX,
    marginVertical: theme.marginY,
    padding: theme.paddingSm,
    justifyContent: "center",
    alignItems: "center",
  },
});
