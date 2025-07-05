'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  TrendingUp,
  Users,
  Music,
  Play,
  Heart,
  Calendar,
  Download,
  Eye,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalPlays: number
    totalUsers: number
    totalSongs: number
    totalLikes: number
    playsGrowth: number
    usersGrowth: number
    songsGrowth: number
    likesGrowth: number
  }
  topSongs: Array<{
    id: string
    title: string
    artist: string
    plays: number
    likes: number
    coverUrl: string
  }>
  topGenres: Array<{
    name: string
    count: number
    percentage: number
    color: string
  }>
  recentActivity: Array<{
    id: string
    type: 'play' | 'like' | 'upload' | 'user'
    description: string
    timestamp: string
    count: number
  }>
  monthlyStats: Array<{
    month: string
    plays: number
    users: number
    songs: number
  }>
}

export default function AdminAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      
      // Mock data - replace with actual API call
      const mockData: AnalyticsData = {
        overview: {
          totalPlays: 125430,
          totalUsers: 8921,
          totalSongs: 1247,
          totalLikes: 23456,
          playsGrowth: 15.2,
          usersGrowth: 8.7,
          songsGrowth: 12.4,
          likesGrowth: 18.9
        },
        topSongs: [
          {
            id: '1',
            title: 'Blinding Lights',
            artist: 'The Weeknd',
            plays: 15420,
            likes: 2341,
            coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'
          },
          {
            id: '2',
            title: 'Shape of You',
            artist: 'Ed Sheeran',
            plays: 12890,
            likes: 1987,
            coverUrl: 'https://images.unsplash.com/photo-1571974599782-87624638275b?w=300&h=300&fit=crop'
          },
          {
            id: '3',
            title: 'Someone Like You',
            artist: 'Adele',
            plays: 11234,
            likes: 1654,
            coverUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=300&fit=crop'
          },
          {
            id: '4',
            title: 'Bohemian Rhapsody',
            artist: 'Queen',
            plays: 10567,
            likes: 1432,
            coverUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop'
          },
          {
            id: '5',
            title: 'Hotel California',
            artist: 'Eagles',
            plays: 9876,
            likes: 1298,
            coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop'
          }
        ],
        topGenres: [
          { name: 'Pop', count: 342, percentage: 27.4, color: '#8B5CF6' },
          { name: 'Rock', count: 289, percentage: 23.2, color: '#06B6D4' },
          { name: 'Hip-Hop', count: 234, percentage: 18.8, color: '#10B981' },
          { name: 'Electronic', count: 198, percentage: 15.9, color: '#F59E0B' },
          { name: 'Jazz', count: 134, percentage: 10.7, color: '#EF4444' },
          { name: 'Other', count: 50, percentage: 4.0, color: '#6B7280' }
        ],
        recentActivity: [
          {
            id: '1',
            type: 'play',
            description: 'Total plays increased',
            timestamp: '2 hours ago',
            count: 1240
          },
          {
            id: '2',
            type: 'user',
            description: 'New users registered',
            timestamp: '4 hours ago',
            count: 23
          },
          {
            id: '3',
            type: 'like',
            description: 'Songs liked',
            timestamp: '6 hours ago',
            count: 456
          },
          {
            id: '4',
            type: 'upload',
            description: 'Songs uploaded',
            timestamp: '8 hours ago',
            count: 7
          }
        ],
        monthlyStats: [
          { month: 'Jan', plays: 12450, users: 234, songs: 45 },
          { month: 'Feb', plays: 13200, users: 287, songs: 52 },
          { month: 'Mar', plays: 14100, users: 321, songs: 48 },
          { month: 'Apr', plays: 15800, users: 389, songs: 63 },
          { month: 'May', plays: 17200, users: 456, songs: 71 },
          { month: 'Jun', plays: 18900, users: 523, songs: 68 },
          { month: 'Jul', plays: 20100, users: 612, songs: 74 }
        ]
      }

      setAnalyticsData(mockData)
    } catch (error) {
      console.error('Error fetching analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'play':
        return <Play className="h-4 w-4 text-green-500" />
      case 'user':
        return <Users className="h-4 w-4 text-blue-500" />
      case 'like':
        return <Heart className="h-4 w-4 text-red-500" />
      case 'upload':
        return <Music className="h-4 w-4 text-purple-500" />
      default:
        return <BarChart3 className="h-4 w-4 text-gray-500" />
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">No analytics data available</h2>
          <p className="text-gray-600 dark:text-gray-400">Unable to load analytics data at this time.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your platform performance and user engagement</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
            className="px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Plays</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(analyticsData.overview.totalPlays)}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <Play className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-500">
                {analyticsData.overview.playsGrowth}%
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(analyticsData.overview.totalUsers)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-500">
                {analyticsData.overview.usersGrowth}%
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Songs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(analyticsData.overview.totalSongs)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <Music className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-500">
                {analyticsData.overview.songsGrowth}%
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Likes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(analyticsData.overview.totalLikes)}
                </p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                <Heart className="h-6 w-6 text-red-600 dark:text-red-300" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-500">
                {analyticsData.overview.likesGrowth}%
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Songs */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Top Performing Songs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topSongs.map((song, index) => (
                <div key={song.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-300">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{song.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{song.artist}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                      <Play className="h-3 w-3" />
                      <span>{formatNumber(song.plays)}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                      <Heart className="h-3 w-3" />
                      <span>{formatNumber(song.likes)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Genres */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Top Genres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topGenres.map((genre) => (
                <div key={genre.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: genre.color }}
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{genre.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {genre.percentage}%
                    </span>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{genre.count} songs</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analyticsData.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatNumber(activity.count)}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{activity.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
