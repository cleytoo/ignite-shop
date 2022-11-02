import axios from "axios";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/future/image";
import { useRouter } from "next/router";
import { useState } from "react";

import Stripe from "stripe";
import { stripe } from "../../lib/stripe";
import {
	ImageContainer,
	ProductContainer,
	ProductDetails,
} from "../../styles/pages/product";

interface ProductProps {
	product: {
		id: string;
		name: string;
		imageUrl: string;
		price: string;
		description: string;
		defaultPriceId: string;
	};
}

export default function Product({ product }: ProductProps) {
	// const { isFallback } = useRouter();
	const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] =
		useState(false);

	// if (isFallback) {
	// 	return <p>Loading...</p>;
	// }

	const handleBuyProduct = async () => {
		try {
			setIsCreatingCheckoutSession(true);

			const res = await axios.post("/api/checkout", {
				priceId: product.defaultPriceId,
			});
			console.log(product.defaultPriceId);

			const { checkoutUrl } = res.data;
			window.location.href = checkoutUrl;
		} catch (error) {
			setIsCreatingCheckoutSession(false);

			alert("Falha ao redirecionar ao checkout");
		}
	};

	return (
		<ProductContainer>
			<ImageContainer>
				<Image src={product.imageUrl} width={520} height={480} alt="" />
			</ImageContainer>

			<ProductDetails>
				<h1>{product.name}</h1>
				<span>{product.price}</span>
				<p>{product.description}</p>

				<button disabled={isCreatingCheckoutSession} onClick={handleBuyProduct}>
					Comprar agora
				</button>
			</ProductDetails>
		</ProductContainer>
	);
}

export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: [
			{
				params: { id: "prod_MfaxBfVMkKgXew" },
			},
		],
		fallback: "blocking",
	};
};

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({
	params,
}) => {
	const productId = params!.id;

	const product = await stripe.products.retrieve(productId, {
		expand: ["default_price"],
	});

	const price = product.default_price as Stripe.Price;

	return {
		props: {
			product: {
				id: product.id,
				name: product.name,
				imageUrl: product.images[0],
				price: new Intl.NumberFormat("pt-BR", {
					style: "currency",
					currency: "BRL",
				}).format(price.unit_amount! / 100),
				description: product.description,
				defaultPriceId: price.id,
			},
		},
		revalidate: 60 * 60 * 1, // 1hr
	};
};
