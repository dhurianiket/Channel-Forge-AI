export async function fetchVideoAnalytics(youtubeVideoId: string): Promise<any> {
    console.log("Simulating fetch metrics for", youtubeVideoId);
    return {
        views: Math.floor(Math.random() * 100000),
        likes: Math.floor(Math.random() * 5000),
        comments: Math.floor(Math.random() * 500),
        subscribersGained: Math.floor(Math.random() * 100),
        ctr: 5.5 + Math.random() * 5,
        averagePercentageViewed: 35 + Math.random() * 20
    };
}
