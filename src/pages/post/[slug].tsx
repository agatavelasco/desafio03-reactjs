import { GetStaticPaths, GetStaticProps } from 'next';
import { Head } from 'next/document';

import { getPrismicClient } from '../../services/prismic';

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
      
      <main className={commonStyles.container}>
        <article className={styles.postContent}>
        <strong>{post.data.title}</strong>
        <p>{post.data.content}</p>

        </article>
      </main>
    </>
  )

}


export const getStaticPaths = async () => {

  return {
    paths: [],
    fallback: 'blocking'
  }

  /*
  const prismic = getPrismicClient();
  const posts = await prismic.query(TODO);

 // TODO
 */
};



export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('posts', String(slug), {});

  const post = {
    first_publication_date: response.first_publication_date,
    title: response.data.title,
    banner: response.data.banner,
    author: response.data.author,
    content: response.data.content,
    }

    return {
      props: {
        post,
      }
    }

  }


 