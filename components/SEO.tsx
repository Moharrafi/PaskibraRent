import React from 'react';
import { Helmet } from 'react-helmet-async';
import { APP_NAME, APP_URL, APP_DESCRIPTION } from '../constants';

interface FAQItem {
    question: string;
    answer: string;
}

interface BreadcrumbItem {
    name: string;
    url: string;
}

interface SEOProps {
    title: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
    faqItems?: FAQItem[];
    breadcrumbs?: BreadcrumbItem[];
    product?: {
        name: string;
        price: number;
        description: string;
        image: string;
        availability: 'InStock' | 'OutOfStock';
    };
}

const SEO: React.FC<SEOProps> = ({
    title,
    description = APP_DESCRIPTION,
    keywords = "sewa kostum paskibra, sewa baju paskibra, kostum paskibra jakarta, kostum paskibra bogor, sewa seragam paskibra, kostum paskibra cileungsi, kostum paskibra cibubur, sewa baju adat bogor, sewa kostum karnaval, atribut paskibra lengkap, sewa jas formal, kostum tari tradisional, sewa baju pdu paskibra, sewa baju pdh paskibra",
    image = "/images/og-banner.png",
    url = APP_URL,
    type = "website",
    faqItems,
    breadcrumbs,
    product,
}) => {
    const siteTitle = `${title} | ${APP_NAME}`;
    const fullUrl = url.startsWith('http') ? url : `${APP_URL}${url}`;
    const fullImage = image.startsWith('http') ? image : `${APP_URL}${image}`;

    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": APP_NAME,
        "image": fullImage,
        "description": APP_DESCRIPTION,
        "url": APP_URL,
        "telephone": "+62895428282092",
        "priceRange": "$$",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Jl. Kp. Cirumput samping mesjid al istiqomah No.60, Limus Nunggal",
            "addressLocality": "Cileungsi",
            "addressRegion": "Jawa Barat",
            "postalCode": "16820",
            "addressCountry": "ID"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": -6.3930125,
            "longitude": 106.9602313
        },
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
                "opens": "08:00",
                "closes": "17:00"
            },
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Saturday","Sunday"],
                "opens": "09:00",
                "closes": "15:00"
            }
        ],
        "sameAs": [
            "https://www.instagram.com/kostume_fadilyss/",
        ]
    };

    // WebSite schema — enables Google sitelinks search box
    const webSiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": APP_NAME,
        "url": APP_URL,
        "description": APP_DESCRIPTION,
        "inLanguage": "id-ID",
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${APP_URL}/catalog?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
        }
    };

    // Organization schema — strengthens brand identity in Google Knowledge Panel
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": APP_NAME,
        "url": APP_URL,
        "logo": `${APP_URL}/images/logo.png`,
        "description": APP_DESCRIPTION,
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+62895428282092",
            "contactType": "customer service",
            "areaServed": "ID",
            "availableLanguage": "Indonesian"
        },
        "sameAs": [
            "https://www.instagram.com/kostume_fadilyss/"
        ]
    };

    const faqSchema = faqItems && faqItems.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqItems.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    } : null;

    // BreadcrumbList schema
    const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((item, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "name": item.name,
            "item": item.url.startsWith('http') ? item.url : `${APP_URL}${item.url}`
        }))
    } : null;

    const productSchema = product ? {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "image": product.image.startsWith('http') ? product.image : `${APP_URL}${product.image}`,
        "brand": {
            "@type": "Brand",
            "name": APP_NAME
        },
        "offers": {
            "@type": "Offer",
            "url": fullUrl,
            "priceCurrency": "IDR",
            "price": product.price,
            "priceValidUntil": new Date(new Date().getFullYear() + 1, 11, 31).toISOString().split('T')[0],
            "availability": `https://schema.org/${product.availability}`,
            "seller": {
                "@type": "Organization",
                "name": APP_NAME
            }
        }
    } : null;

    return (
        <Helmet>
            <title>{siteTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={fullUrl} />

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:locale" content="id_ID" />
            <meta property="og:site_name" content={APP_NAME} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={fullUrl} />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullImage} />

            {/* Structured Data */}
            <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
            <script type="application/ld+json">{JSON.stringify(webSiteSchema)}</script>
            <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
            {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
            {breadcrumbSchema && <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>}
            {productSchema && <script type="application/ld+json">{JSON.stringify(productSchema)}</script>}
        </Helmet>
    );
};

export default SEO;

