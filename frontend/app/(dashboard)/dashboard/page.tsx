'use client'

import { useQuery } from '@tanstack/react-query'
import { examApi, submissionApi, userApi } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CalendarCheck2, ListChecks, Clock, Users } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Exam, Submission, User } from '@/types'

export default function DashboardPage() {
  // Fetch exams
  const { data: exams = [], isLoading: examsLoading } = useQuery<Exam[]>({
    queryKey: ['exams'],
    queryFn: async () => {
      const { data } = await examApi.getAll()
      return data
    },
  })

  // Fetch user submissions
  const { data: submissions = [], isLoading: submissionsLoading } = useQuery<Submission[]>({
    queryKey: ['submissions'],
    queryFn: async () => {
      const { data } = await submissionApi.getByUser()
      return data
    },
  })

  // Fetch current user
  const { data: user } = useQuery<User>({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await userApi.getCurrentUser()
      return data
    },
  })

  const isAdmin = user?.role === 'admin'

  const upcomingExams = exams.filter((exam: Exam) => {
    const hasTimeBlocks = exam.timeBlocks && exam.timeBlocks.length > 0
    if (!hasTimeBlocks) return false
    
    const now = new Date().getTime()
    return exam.timeBlocks.some((block) => {
      const startTime = new Date(block.startTime).getTime()
      return startTime > now
    })
  }).slice(0, 3)

  const recentSubmissions = submissions.slice(0, 3)

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        {isAdmin && (
          <div className="flex gap-2">
            <Button asChild variant="gradient">
              <Link href="/exams/new">Create New Exam</Link>
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Exams
            </CardTitle>
            <ListChecks className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{examsLoading ? '...' : exams.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {isAdmin ? 'Exams created' : 'Exams available'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Submissions
            </CardTitle>
            <CalendarCheck2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissionsLoading ? '...' : submissions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {isAdmin ? 'Total submissions' : 'Your submissions'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming Exams
            </CardTitle>
            <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{examsLoading ? '...' : upcomingExams.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Within the next week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {isAdmin ? 'Students' : 'Completion Rate'}
            </CardTitle>
            <Users className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isAdmin ? '120' : `${submissionsLoading || examsLoading ? '...' : Math.round((submissions.length / Math.max(exams.length, 1)) * 100)}%`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isAdmin ? 'Registered users' : 'Exams completed'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="upcoming">Upcoming Exams</TabsTrigger>
          <TabsTrigger value="recent">Recent Submissions</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="space-y-4 pt-4">
          <h3 className="text-lg font-medium">Upcoming Exams</h3>
          {examsLoading ? (
            <div className="animate-pulse">Loading...</div>
          ) : upcomingExams.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingExams.map((exam: Exam) => (
                <Card key={exam.id}>
                  <CardHeader>
                    <CardTitle>{exam.title}</CardTitle>
                    <CardDescription>
                      {exam.timeBlocks && exam.timeBlocks[0] ? (
                        <>Starts {formatDate(exam.timeBlocks[0].startTime)}</>
                      ) : (
                        'No start time specified'
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {exam.description || 'No description provided.'}
                    </p>
                  </CardContent>
                  <div className="px-6 pb-4">
                    <Button asChild variant="exam" className="w-full">
                      <Link href={`/exams/${exam.id}`}>View Details</Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No upcoming exams scheduled.</p>
          )}
          <div className="mt-4">
            <Button asChild variant="outline">
              <Link href="/exams">View All Exams</Link>
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="recent" className="space-y-4 pt-4">
          <h3 className="text-lg font-medium">Recent Submissions</h3>
          {submissionsLoading ? (
            <div className="animate-pulse">Loading...</div>
          ) : recentSubmissions.length > 0 ? (
            <div className="space-y-2">
              {recentSubmissions.map((submission: Submission) => (
                <Card key={submission.id}>
                  <CardHeader className="py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{submission.examTitle || 'Untitled Exam'}</CardTitle>
                        <CardDescription>Submitted on {formatDate(submission.createdAt)}</CardDescription>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium
                        ${submission.status === 'graded' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                        }`}>
                        {submission.status === 'graded' ? 'Graded' : 'Pending'}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No recent submissions found.</p>
          )}
          <div className="mt-4">
            <Button asChild variant="outline">
              <Link href="/submissions">View All Submissions</Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
