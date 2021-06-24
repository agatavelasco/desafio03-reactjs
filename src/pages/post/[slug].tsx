import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { getPrismicClient } from '../../services/prismic';
import PrismicDOM from 'prismic-dom';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
 
  return (
    <>
      <Head>
        <title>{post.data.title}</title>
      </Head>
      <main>
        

        <section className={commonStyles.container}>
          <img src={post.data.banner.url} alt="banner post" />
          <strong>{post.data.title}</strong>
            {post.data.content.map(({ heading, body }) => (
              <div key={heading}>
                <h1>{heading}</h1>
                <div
                  dangerouslySetInnerHTML={{
                    __html: PrismicDOM.RichText.asHtml(body),
                  }}
                />
              </div>
            ))}
          </section>

      </main>
    </>
  );
}

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
//  const prismic = getPrismicClient();
//  const posts = await prismic.query();

 };

export const getStaticProps: GetStaticProps =  async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});
  
  const post = {
    first_publication_date: response.first_publication_date,
    uid: response.uid,
    data: {
      ...response.data
      // title: response.data.title,
      // subtitle: response.data.subtitle,
      // banner: response.data.banner,
      // author: response.data.author,
      // content: response.data.content.map(({ heading, body }) => {
      //   return {
      //     heading: heading,
      //     body: body,
      //   };
      // }),
    }
  }

  return {
    props: {
      post,
    }
  }
};