import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import React from "react";
import { getAllPostIds, getPostData } from "../../lib/post";
import postStyle from "../../styles/Post.module.css";

const Post = ({
  postData,
}: {
  postData: {
    title: string;
    date: string;
    contentHtml: string;
  };
}) => {
  return (
    <div className={postStyle.container}>
      <Head>{postData.title}</Head>
      <article>
        <h1>{postData.title}</h1>
        <div>{postData.date}</div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </div>
  );
};

export default Post;

export const getStaticPaths: GetStaticPaths = async () => {
  // 파일의 이름(id)를 배열로 반환 -> 경로에 사용
  const paths = getAllPostIds();
  // [ {params : {id: 'pre-rendering'}}, {params : {id: 'ssg-ssr'}}]
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // params : {id : 'ssg-ssr'}
  const postData = await getPostData(params?.id as string);
  return {
    props: {
      postData,
    },
  };
};
