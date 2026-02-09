import ExternalLink from '@/components/ExternalLink';
import { getMovieDetails, MovieDetails } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Skeleton Loader Component ---
const SkeletonItem = ({ style }: { style: any }) => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return <Animated.View style={[style, { opacity, backgroundColor: '#333' }]} />;
};

export default function MovieDetail() {
  const { id, title: paramTitle, poster: paramPoster } = useLocalSearchParams();
  const router = useRouter();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Optimistic Data
  const optimisticTitle = typeof paramTitle === 'string' ? decodeURIComponent(paramTitle) : '';
  const optimisticPoster = typeof paramPoster === 'string' ? decodeURIComponent(paramPoster) : '';

  useEffect(() => {
    const loadMovie = async () => {
      if (typeof id !== 'string') return;
      setLoading(true);
      const data = await getMovieDetails(id);
      setMovie(data);
      setLoading(false);
    };
    loadMovie();
  }, [id]);

  // Display Logic: Use full movie data if available, else optimistic data
  const displayTitle = movie?.title || optimisticTitle;
  const displayBackdrop = movie?.imageSet?.horizontalPoster?.w1080 ||
    movie?.imageSet?.verticalPoster?.w720 ||
    optimisticPoster ||
    'https://via.placeholder.com/1080x600?text=No+Image';

  return (
    <View className="flex-1 bg-[#121212]">
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header / Hero Section (Optimistic) */}
        <View className="relative h-[65vh] w-full">
          <Image
            source={{ uri: displayBackdrop }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(18,18,18,0.1)', '#121212']}
            locations={[0, 0.4, 1]}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 500 }}
          />

          {/* Back Button */}
          <SafeAreaView className="absolute top-0 left-0 z-50 ml-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-black/40 p-2 rounded-full backdrop-blur-md border border-white/10"
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          </SafeAreaView>

          {/* Title & Info Overlay */}
          <View className="absolute bottom-0 left-0 px-5 pb-4 w-full">
            <Text className="text-4xl font-extrabold text-white tracking-wide leading-tight mb-3 shadow-lg">
              {displayTitle}
            </Text>

            {!loading && movie && (
              <View className="flex-row items-center flex-wrap gap-2 mb-5">
                {movie.genres?.slice(0, 3).map((genre) => (
                  <View key={genre.id} className="bg-white/10 px-2.5 py-1 rounded-md border border-white/10">
                    <Text className="text-white text-xs font-semibold">{genre.name}</Text>
                  </View>
                ))}
                <View className="flex-row items-center ml-1">
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text className="text-white font-bold ml-1 text-sm">{movie.rating?.toFixed(1) || 'N/A'}</Text>
                </View>
                <Text className="text-gray-300 text-sm ml-2">{movie.releaseYear}</Text>
              </View>
            )}

            {/* Action Buttons */}
            <View className="flex-row gap-4 mb-2">
              <TouchableOpacity className="flex-1 bg-primary py-3.5 rounded-xl flex-row justify-center items-center shadow-lg shadow-black/50">
                <Ionicons name="play" size={22} color="black" />
                <Text className="text-black font-bold text-lg ml-2">Watch Now</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-[#2A2A2A] py-3.5 rounded-xl flex-row justify-center items-center border border-white/10">
                <Ionicons name="add" size={24} color="white" />
                <Text className="text-white font-bold text-lg ml-2">My List</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Content Body (Loading State) */}
        {loading ? (
          <View className="px-5 mt-4">
            <SkeletonItem style={{ width: '60%', height: 40, marginBottom: 10, borderRadius: 8 }} />
            <View className="flex-row gap-2 mb-6">
              <SkeletonItem style={{ width: 60, height: 20, borderRadius: 4 }} />
              <SkeletonItem style={{ width: 40, height: 20, borderRadius: 4 }} />
            </View>
            <SkeletonItem style={{ width: '100%', height: 100, borderRadius: 8, marginBottom: 20 }} />
          </View>
        ) : (
          movie && (
            <View className="px-5 pb-10">

              {/* WHERE TO WATCH SECTION */}
              {movie.streamingOptions?.us && (
                <View className="mb-8">
                  <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Where to Watch</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                    {movie.streamingOptions.us.map((option: any, index: number) => (
                      <TouchableOpacity
                        key={`${option.service.name}-${index}`}
                        onPress={() => Linking.openURL(option.link)}
                        className="mr-4 items-center"
                      >
                        <View className="w-16 h-16 rounded-2xl bg-[#1F1F1F] border border-white/10 justify-center items-center p-2 overflow-hidden shadow-sm">
                          <Image
                            source={{ uri: option.service.imageSet.lightThemeImage }}
                            className="w-full h-full"
                            resizeMode="contain"
                          />
                        </View>
                        <Text className="text-gray-400 text-[10px] mt-2 text-center w-16" numberOfLines={1}>
                          {option.service.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Synopsis */}
              <View className="mb-8">
                <Text className="text-white text-xl font-bold mb-3">Synopsis</Text>
                <Text className="text-gray-400 leading-7 text-base">
                  {movie.overview}
                </Text>
                {movie.directors && movie.directors.length > 0 && (
                  <View className="mt-4 flex-row">
                    <Text className="text-gray-500 text-sm mr-2">Director:</Text>
                    <Text className="text-gray-300 text-sm font-semibold">{movie.directors.join(', ')}</Text>
                  </View>
                )}
              </View>

              {/* Cast Section */}
              {movie.cast && movie.cast.length > 0 && (
                <View className="mb-8">
                  <Text className="text-white text-xl font-bold mb-4">Cast</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {movie.cast.map((actor, index) => (
                      <View key={index} className="mr-4 items-center w-20">
                        <View className="w-16 h-16 rounded-full bg-gray-800 mb-2 overflow-hidden border border-white/5">
                          <Image
                            source={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(actor)}&background=random&color=fff` }}
                            className="w-full h-full"
                          />
                        </View>
                        <Text className="text-gray-300 text-xs text-center font-medium" numberOfLines={2}>{actor}</Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}

              <ExternalLink
                url="https://simkl.com"
                text="Powered by Simkl"
                style={{ marginTop: 20, marginBottom: 40 }}
              />
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
}
