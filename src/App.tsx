import { useState } from "react";
import {
  useInfiniteQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const getPosts = async (page: number = 1) => {
  const data = await fetch(
    `https://jsonplaceholder.typicode.com/comments?_page=${page}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
  return data;
};

// function PostBlock(title: string) {
//   const [shownNumber, setShownNumber] = useState(1);
//   return <ul>{title}</ul>;
// }

function Posts() {
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["hoge"],
    queryFn: async ({ pageParam = 1 }) => {
      const posts = await getPosts(pageParam);
      return posts;
    },
    getNextPageParam: (_, allPages) => allPages.length + 1,
  });

  // data.pagesを変形して、複数postblock分作る必要がある

  console.log(data?.pages);
  const object1 = data?.pages.reduce((result, item) => {
    console.log({ item });
    const domain = item.email.split(".")[1];
    if (!result[domain]) {
      result[domain] = { name: domain, list: [item] };
    } else {
      result[domain].list.push(item);
    }
    return result;
  }, {});
  console.log(object1);

  /** example
   * uk: {
   * },
   * us: {
   * }
   */

  return (
    <div>
      <ul>{data?.pages.map((page) => page.map((comment) => <div />))}</ul>
      {isFetchingNextPage && <div>isFetchingNextPage</div>}
      <button onClick={() => fetchNextPage()}>load more</button>
    </div>
  );
}

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Posts />
      </QueryClientProvider>
    </>
  );
}

export default App;
