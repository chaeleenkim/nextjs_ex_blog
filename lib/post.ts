import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");
// 현재 디렉토리
console.log("process.cwd()", process.cwd());
// posts의 경로
console.log("postsDirectory", postsDirectory);

export function getSortedPostsData() {
  // posts 파일 이름을 잡아주기
  const fileNames = fs.readdirSync(postsDirectory);
  // fileName이 들어있는 배열
  const allPostsData = fileNames.map((fileName) => {
    // Remove .md from file name to get id
    const id = fileName.replace(/\.md$/, "");
    // Read mardkown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    // matter : 마크다운 파일을 객체 데이터로 변홬하는 모듚
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...(matterResult.data as { date: string; title: string }),
    };
  });
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

// 경로로 사용할 id값 반환
export function getAllPostIds() {
  // 현재 디렉토리의 파일 이름들을 배열로 만듦
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames.map((fileName) => {
    return {
      params: {
        // 파일명 뒤의 .md 제거
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

// md 파일 데이터를 가져와서 보여주기
export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // matter : 마크다운 파일을 객체 데이터로 변홬하는 모듚
  const matterResult = matter(fileContents);

  //  Use remark to convert markdown into HTML string
  const proccessedContent = await remark()
    .use(remarkHtml)
    .process(matterResult.content);
  const contentHtml = proccessedContent.toString();

  //   Combine the data with th id and contentHtml
  return {
    id,
    contentHtml,
    ...(matterResult.data as { date: string; title: string }),
  };
}
