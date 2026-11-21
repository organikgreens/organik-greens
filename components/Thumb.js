// Card image for an article: its thumbnail, else its cover photo, else the category emoji.
export default function Thumb({ post, className = 'blog-thumb', eager = false }) {
  const src = post.thumbnail || post.cover_image;
  if (!src) return <div className={className}>{post.emoji || '🌱'}</div>;
  return (
    <div className={`${className} has-img`}>
      <img src={src} alt="" loading={eager ? 'eager' : 'lazy'} decoding="async" />
    </div>
  );
}
