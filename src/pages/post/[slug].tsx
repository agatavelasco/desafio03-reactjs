import { GetStaticPaths, GetStaticProps } from 'next';
import { Head } from 'next/document';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
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

  const post = await prismic.getByUID('posts', String(slug), {});

  const posts = {
      slug,
      first_publication_date: format( new Date(post.first_publication_date), 'PP',
        {
          locale: ptBR,
        }),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author
      },
      
      }
    

    return {
      props: {
        posts,
      }
    }

  }



 