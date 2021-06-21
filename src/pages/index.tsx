import { GetStaticProps } from 'next';
import Head from 'next/head';
import Prismic from '@prismicio/client';
import { getPrismicClient } from '../services/prismic';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { FiCalendar, FiUser } from "react-icons/fi";
import { format, toDate } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

type Posts = {
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  updatedAt: string;
};


interface PostPagination {
  next_page: string;
  results: Posts[];
}

interface HomeProps {
  posts: Posts[]; 
}

export default function Home({ posts }: HomeProps) {
  return (
    <>
      <Head>
        <title>spacetraveling | posts</title>
      </Head>
      <main className={commonStyles.container}>
        <div className={styles.contentContainer}>
          {posts.map(post => (

            <a key={post.slug} href="#">
              <strong>{post.title}</strong>
              <p>{post.subtitle}</p>
              <p>
                <FiCalendar /> {post.updatedAt} 
                <FiUser /> {post.author} 
              </p>
            </a>
          ))}

            <p>
              <a href="#" className={styles.loadMore}>
                Carregar mais posts
              </a>
            </p>
            
        </div>
      </main>
    </>
  )
 }

export const getStaticProps : GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.Predicates.at('document.type', 'posts')
  ], {
    fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
    pageSize: 10,
  });

  console.log(JSON.stringify(postsResponse, null, 2));

  const posts = postsResponse.results.map(posts => {
    return {
      slug: posts.uid,
      title: posts.data.title,
      subtitle: posts.data.subtitle,
      author: posts.data.author,
      updatedAt: format( new Date(posts.last_publication_date), 'PP',
        {
          locale: ptBR,
        })
      }
    }
  );

  return {
    props: {
      posts
    }
  }

};
