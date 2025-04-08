// utils.ts
export const getViewedPostIds = () => {
  return JSON.parse(localStorage.getItem("viewedPosts") || "[]");
};

export const addViewedPostId = (postId: number) => {
  const viewed = getViewedPostIds();
  if (!viewed.includes(postId)) {
    localStorage.setItem("viewedPosts", JSON.stringify([...viewed, postId]));
  }
};
