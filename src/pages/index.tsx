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
  postsPagination : PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);


  async function handleLoadPosts() {
    await fetch(nextPage ? nextPage : '')
      .then(response => response.json())
      .then(data => {
        const formattedData = postFormatter(data);
        setPosts([...posts, ...formattedData.results])
        setNextPage(formattedData.next_page)
      })
  } 


  return (
    <>
      <Head>
        <title>spacetraveling | posts</title>
      </Head>
      <main className={commonStyles.container}>
        <div className={styles.contentContainer}>
          {postsPagination.results.map(post => (
            <Link key={post.uid} href={`/post/${post.uid}`}>
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

 const postsPagination = postFormatter(postsResponse); 

  return {
    props: {
      postsPagination
    }
  }

};

export function postFormatter (prismicResponse : PostPagination)
 {
    const posts = prismicResponse.results.map(post => {
      return {
        slug: post.uid,
        first_publication_date: post.first_publication_date,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author
        },
      };
    })

    const formattedData = {
      next_page : prismicResponse.next_page,
      results : posts
    }

    return formattedData
    
 }