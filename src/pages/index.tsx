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
import { useState } from 'react';


interface Post {
  slug?: string;
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

export default function Home({ results, next_page }: PostPagination) {
  const [post, setPost] = useState(results);
  const [nextPage, setNextPage] = useState(next_page);


  function handleLoadPosts() {
    console.log('ESTE É O POST', post)
    console.log('ESTE É O NEXTPAGE', nextPage)
  } 


  return (
    <>
      <Head>
        <title>spacetraveling | posts</title>
      </Head>
      <main className={commonStyles.container}>
        <div className={styles.contentContainer}>
          {results.map(post => (
            <Link href={`/post/${post.slug}`} key={post.slug}>
              <a>
                <strong>{post.data.title}</strong>
                <p>{post.data.subtitle}</p>
                <span>
                  <span>
                    <FiCalendar />
                    {'    ' + format( new Date(post.first_publication_date), 'PP',
                    {
                      locale: ptBR,
                    })}
                  </span>
                  <span>
                    <FiUser /> {post.data.author}
                  </span>
                </span>
              </a>
            </Link>
          ))}

            <p>
              <a href="#" className={styles.loadMore}>
              {nextPage ? (
                <button type="button" onClick={handleLoadPosts}>
                  Carregar mais posts
                </button> 
              ) : (
                ''
              )}
               
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

  //console.log(JSON.stringify(postsResponse, null, 2));

  const results = postsResponse.results.map(posts => {
    
    return {
      slug: posts.uid,
      first_publication_date: posts.first_publication_date,
      data: {
        title: posts.data.title,
        subtitle: posts.data.subtitle,
        author: posts.data.author
      },
      }
    }
  );

  const next_page = {
    next_page: postsResponse.next_page,
  }
  console.log(next_page)
  return {
    props: {
      results,
      next_page,
    }
  }

};
