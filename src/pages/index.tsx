import type { GetStaticProps } from "next";
import Image from "next/future/image";
import Link from "next/link";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import { HomeContainer, Product } from "../styles/pages/home";

import { stripe } from "../lib/stripe";
import Stripe from "stripe";
import Head from "next/head";

interface HomeProps {
	products: {
		id: string;
		name: string;
		imageUrl: string;
		price: string;
	}[];
}

const Home = ({ products }: HomeProps) => {
	const [sliderRef] = useKeenSlider({
		slides: {
			perView: 3,
			spacing: 48,
		},
	});

	return (
		<>
			<Head>
				<title>Ignite shop</title>
			</Head>
			<HomeContainer ref={sliderRef} className="keen-slider">
				{products.map((product) => (
					<Link href={`/product/${product.id}`} key={product.id}>
						<Product className="keen-slider__slide">
							<Image src={product.imageUrl} height={520} width={480} alt="" />

							<footer>
								<strong>{product.name}</strong>
								<span>{product.price}</span>
							</footer>
						</Product>
					</Link>
				))}
			</HomeContainer>
		</>
	);
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
	const { data } = await stripe.products.list({
		expand: ["data.default_price"],
	});

	const products = data.map((product) => {
		const price = product.default_price as Stripe.Price;
		return {
			id: product.id,
			name: product.name,
			imageUrl: product.images[0],
			price: new Intl.NumberFormat("pt-BR", {
				style: "currency",
				currency: "BRL",
			}).format(price.unit_amount! / 100),
		};
	});

	return {
		props: {
			products,
		},
		revalidate: 60 * 60 * 2, // 2hrs
	};
};
