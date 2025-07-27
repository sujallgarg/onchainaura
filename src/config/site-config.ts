import { Metadata } from "next";

const TITLE = "Onchain-Aura";
const DESCRIPTION = "Discover Your Aura Score based on your onchain journey";

const BASE_URL = "https://onchainaura.fun";


export const siteConfig: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    icons: {
        icon: "/favicon.ico",
    },
    applicationName: TITLE,
    openGraph: {
        type: "website",
        locale: "en_IE",
        url: BASE_URL,
        title: TITLE,
        description: DESCRIPTION,
        images: [
            {
                url: "/image.png",
                width: 1200,
                height: 630,
                alt: TITLE,
            },
        ],
    },
    category: "Cryptocurrency",
    alternates: {
        canonical: BASE_URL,
    },
    twitter: {
        creator: '@onchainaura_fun',
        title: TITLE,
        description: DESCRIPTION,
        card: 'summary_large_image',
        images: [
            {
                url: "/image.png",
                width: 1200,
                height: 630,
            },
        ],
    },
    keywords: [
        "onchain",
        "onchain score",
        "aura onchain",
        "onchainaura",
        "auraonchain",
        "web3 wrapped",
        "web3 recap",
        "crypto recap",
        "aura",
        "web3 rewind",
        "ethereum",
        "nft",
        "cryptocurrency",
        "web3",
        "blockchain",
        "decentralized",
        "decentralized finance",
        "defi",
        "defi score",
    ],
    metadataBase: new URL(BASE_URL),
};