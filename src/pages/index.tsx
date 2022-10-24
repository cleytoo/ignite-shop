import type { NextPage } from "next";
import Image from "next/future/image";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import { HomeContainer, Product } from "../styles/pages/home";

import camiseta1 from "../assets/camisetas/1.png";
import camiseta2 from "../assets/camisetas/2.png";
import camiseta3 from "../assets/camisetas/3.png";

const Home: NextPage = () => {
	const [sliderRef] = useKeenSlider({
		slides: {
			perView: 3,
			spacing: 48,
		},
	});

	return (
		<HomeContainer ref={sliderRef} className="keen-slider">
			<Product className="keen-slider__slide">
				<Image src={camiseta1} height={520} width={480} alt="" />

				<footer>
					<strong>Camiseta X</strong>
					<span>R$ 79,90</span>
				</footer>
			</Product>
			<Product className="keen-slider__slide">
				<Image src={camiseta2} height={520} width={480} alt="" />

				<footer>
					<strong>Camiseta X</strong>
					<span>R$ 79,90</span>
				</footer>
			</Product>
			<Product className="keen-slider__slide">
				<Image src={camiseta3} height={520} width={480} alt="" />

				<footer>
					<strong>Camiseta X</strong>
					<span>R$ 79,90</span>
				</footer>
			</Product>
			<Product className="keen-slider__slide">
				<Image src={camiseta3} height={520} width={480} alt="" />

				<footer>
					<strong>Camiseta X</strong>
					<span>R$ 79,90</span>
				</footer>
			</Product>
		</HomeContainer>
	);
};

export default Home;
