import { Client } from 'twitter-api-sdk'

const client = new Client(process.env.TWITTER_BEARER_TOKEN ?? '')
export interface Tweet {
  id: string
  replyTo?: string
  likes: number
  text: string
  name: string
  username: string
  description: string
  image: string
}

export const getThreads = async (query: string, count: number, start_time: string): Promise<Tweet[][] | null> => {
  try {
    // Gets most liked tweets from yesterday
    const tweets = []
    const tweetsSearch = client.tweets.tweetsRecentSearch({
      query,
      start_time,
      'tweet.fields': ['public_metrics', 'referenced_tweets'],
      expansions: ['author_id'],
      'user.fields': ['name', 'username', 'description', 'profile_image_url'],
      max_results: 100,
    })

    for await (const page of tweetsSearch) {
      const pageTweets: Tweet[] =
        page.data?.map(t => ({
          id: t.id,
          replyTo: t.referenced_tweets?.find(r => r.type === 'replied_to')?.id,
          likes: t.public_metrics?.like_count ?? 0,
          text: t.text,
          name: page.includes?.users?.find(u => u.id === t.author_id)?.name ?? '',
          username: page.includes?.users?.find(u => u.id === t.author_id)?.username ?? '',
          description: page.includes?.users?.find(u => u.id === t.author_id)?.description ?? '',
          image: page.includes?.users?.find(u => u.id === t.author_id)?.profile_image_url ?? '',
        })) ?? []
      tweets.push(...pageTweets)
    }
    const top5 = tweets.sort((a, b) => b.likes - a.likes).slice(0, count)

    // Getting threads of those top5 tweets
    const threads: Tweet[][] = []
    for await (const tweet of top5) {
      let replyTo = tweet.replyTo
      const thread: Tweet[] = []

      while (replyTo) {
        const result = await client.tweets.findTweetById(replyTo, {
          expansions: ['author_id'],
          'tweet.fields': ['public_metrics', 'referenced_tweets'],
          'user.fields': ['id', 'name', 'description', 'username', 'profile_image_url'],
        })
        if (result.data) {
          const newTweet = {
            replyTo: result.data.referenced_tweets?.find(r => r.type === 'replied_to')?.id,
            likes: result.data.public_metrics?.like_count ?? 0,

            id: result.data.id,

            text: result.data.text,
            name: result.includes?.users?.find(u => u.id === result.data?.author_id)?.name ?? '',
            username: result.includes?.users?.find(u => u.id === result.data?.author_id)?.username ?? '',
            description: result.includes?.users?.find(u => u.id === result.data?.author_id)?.description ?? '',
            image: result.includes?.users?.find(u => u.id === result.data?.author_id)?.profile_image_url ?? '',
          }
          thread.push(newTweet)
          replyTo = newTweet.replyTo
        } else {
          console.log('error')
          break
        }
      }
      threads.push(thread.reverse())
    }
    return threads
  } catch (error) {
    console.log(error) //eslint-disable-line
    return null
  }
}
