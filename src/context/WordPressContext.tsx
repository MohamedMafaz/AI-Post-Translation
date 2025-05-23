
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

// Define types for WordPress API responses
export type WPPostData = {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  slug: string;
  date: string;
  link: string;
};

// Define our app-specific Post type
export type Post = {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  date: string;
  link: string;
  selected: boolean;
};

type WordPressCredentials = {
  siteUrl: string;
  username: string;
  appPassword: string;
};

type WordPressContextType = {
  credentials: WordPressCredentials | null;
  setCredentials: (credentials: WordPressCredentials) => void;
  isConnected: boolean;
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  selectedPosts: Post[];
  togglePostSelection: (postId: number) => void;
  selectAllPosts: () => void;
  unselectAllPosts: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  clearConnection: () => void;
};

const WordPressContext = createContext<WordPressContextType | undefined>(undefined);

export const WordPressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [credentials, setCredentials] = useState<WordPressCredentials | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isConnected = !!credentials;

  const togglePostSelection = (postId: number) => {
    setPosts(currentPosts => 
      currentPosts.map(post => 
        post.id === postId ? { ...post, selected: !post.selected } : post
      )
    );
  };

  const selectAllPosts = () => {
    setPosts(currentPosts => 
      currentPosts.map(post => ({ ...post, selected: true }))
    );
    toast.success("All posts selected");
  };

  const unselectAllPosts = () => {
    setPosts(currentPosts => 
      currentPosts.map(post => ({ ...post, selected: false }))
    );
    toast.success("All posts unselected");
  };

  const clearConnection = () => {
    setCredentials(null);
    setPosts([]);
    setError(null);
    toast.success("Connection cleared");
  };

  const selectedPosts = posts.filter(post => post.selected);

  return (
    <WordPressContext.Provider 
      value={{
        credentials,
        setCredentials,
        isConnected,
        posts,
        setPosts,
        selectedPosts,
        togglePostSelection,
        selectAllPosts,
        unselectAllPosts,
        loading,
        setLoading,
        error,
        setError,
        clearConnection
      }}
    >
      {children}
    </WordPressContext.Provider>
  );
};

export const useWordPress = (): WordPressContextType => {
  const context = useContext(WordPressContext);
  if (context === undefined) {
    throw new Error('useWordPress must be used within a WordPressProvider');
  }
  return context;
};
