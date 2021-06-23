import { GetStaticProps } from 'next';
import Head from 'next/head';
import Prismic from '@prismicio/client';
import { getPrismicClient } from '../services/prismic';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { FiCalendar, FiUser } from "react-icons/fi";
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data : {
    title: string;
    subtitle: string;
    author: string;
  }
};


interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  posts: Post[]; 
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

            <Link href={`/post/${post.uid}`}>
              <a key={post.uid}>
                <strong>{post.data.title}</strong>
                <p>{post.data.subtitle}</p>
                <p className={styles.fiUser}>
                  <FiCalendar /> {post.first_publication_date} 
                  <FiUser /> {post.data.author} 
                </p>
              </a>
            </Link>
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
    pageSize: 2,
  });

  console.log(JSON.stringify(postsResponse, null, 2));

  const posts = postsResponse.results.map(posts => {
    return {
      slug: posts.uid,
      data: {
        title: posts.data.title,
        subtitle: posts.data.subtitle,
        author: posts.data.author
      },
      first_publication_date: format( new Date(posts.first_publication_date), 'PP',
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
