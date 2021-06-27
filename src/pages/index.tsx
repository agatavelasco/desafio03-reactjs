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

export default function Home({ posts }: HomeProps) {
  const [post, setPost] = useState();
  const [nextPage, setNextPage] = useState();

/*
  async function handleLoadPosts {
    await fetch(nextPage ? nextPage : '')
    .then(response => response.json())
    .then(data => {

    })
  } 

*/
  return (
    <>
      <Head>
        <title>spacetraveling | posts</title>
      </Head>
      <main className={commonStyles.container}>
        <div className={styles.contentContainer}>
          {posts.map(post => (
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
               <button 
               type="button"

               >Carregar mais posts</button> 
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

  const posts = postsResponse.results.map(posts => {
    
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

  const nextPage = {
    next_page: postsResponse.next_page,
  }
  return {
    props: {
      posts,
      nextPage,
    }
  }

};
