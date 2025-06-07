import type { Metadata } from "next";

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
): Promise<Metadata> {
  // Get report ID from search params
  const reportId = searchParams.id as string;
  
  if (!reportId) {
    return {
      title: "AI Career Risk Assessment | Career Guard",
      description: "View your personalized AI replacement risk assessment with actionable strategies to future-proof your career.",
    };
  }

  try {
    // Fetch report data for metadata (this runs server-side)
    const reportResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://willaireplace.me'}/api/reports/${reportId}`, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });

    if (reportResponse.ok) {
      const reportData = await reportResponse.json();
      const score = reportData.score || 50;
      
      const getRiskLevelText = (score: number) => {
        if (score <= 33) return "Low Risk";
        if (score <= 66) return "Moderate Risk";
        return "High Risk";
      };

      const riskLevel = getRiskLevelText(score);
      const title = `My AI Career Risk Assessment - ${score}/100 (${riskLevel})`;
      const description = `I just completed my AI replacement risk assessment! My risk score is ${score}/100 (${riskLevel}). Get your personalized analysis and strategies to future-proof your career.`;

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          url: `https://willaireplace.me/report?id=${reportId}&paid=true`,
          siteName: "Career Guard",
          images: [
            {
              url: "/Website-screenshot.png",
              width: 1200,
              height: 630,
              alt: `AI Career Risk Assessment - ${score}/100 Risk Score`,
            },
          ],
          locale: "en_US",
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images: ["/Website-screenshot.png"],
        },
      };
    }
  } catch (error) {
    console.error('Failed to fetch report data for metadata:', error);
  }

  // Fallback metadata
  return {
    title: "AI Career Risk Assessment | Career Guard",
    description: "View your personalized AI replacement risk assessment with actionable strategies to future-proof your career.",
    openGraph: {
      title: "AI Career Risk Assessment | Career Guard",
      description: "Discover your likelihood of being replaced by AI and get personalized strategies to future-proof your career.",
      url: "https://willaireplace.me/report",
      siteName: "Career Guard",
      images: [
        {
          url: "/Website-screenshot.png",
          width: 1200,
          height: 630,
          alt: "Career Guard - AI Career Risk Assessment",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "AI Career Risk Assessment | Career Guard",
      description: "Discover your likelihood of being replaced by AI and get personalized strategies to future-proof your career.",
      images: ["/Website-screenshot.png"],
    },
  };
}

export default function ReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 