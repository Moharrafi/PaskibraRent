import React from 'react';
import { Helmet } from 'react-helmet-async';
import { APP_NAME } from '../constants';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    keywords = "sewa kostum paskibra, sewa baju paskibra, kostum paskibra jakarta, kostum paskibra bogor, sewa seragam paskibra",
    image = "/images/logo.png",
    url = "https://paskibrarent.vercel.app/",
    type = "website"
}) => {
    const siteTitle = `${title} | ${APP_NAME}`;
    const fullUrl = url.startsWith('http') ? url : `https://paskibrarent.vercel.app${url}`;
    const fullImage = image.startsWith('http') ? image : `https://paskibrarent.vercel.app${image}`;

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": APP_NAME,
        "image": fullImage,
        "description": description,
        "url": "https://paskibrarent.vercel.app/",
        "telephone": "+62895428282092",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Jl. Pahlawan No.41, Limus Nunggal",
            "addressLocality": "Cileungsi",
            "addressRegion": "Jawa Barat",
            "postalCode": "16820",
            "addressCountry": "ID"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": -6.415,
            "longitude": 106.965
        },
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday"
                ],
                "opens": "08:00",
                "closes": "17:00"
            },
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                    "Saturday",
                    "Sunday"
                ],
                "opens": "09:00",
                "closes": "15:00"
            }
        ],
        "priceRange": "$$"
    };

    return (
        <Helmet>
            {/* Standard Meta Tags */}
            <title>{siteTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={fullUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={fullUrl} />
            <meta property="twitter:title" content={siteTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={fullImage} />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(schemaData)}
            </script>
        </Helmet>
    );
};

export default SEO;
