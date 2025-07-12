"use client";

import { useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ExternalLink,
  GitPullRequest,
  Calendar,
  User,
  Loader2,
  Filter,
} from "lucide-react";
import Link from "next/link";

interface PullRequest {
  title: string;
  url: string;
  created_at: string;
  merged_at?: string;
  state: string;
  draft?: boolean;
  labels: { name: string; color: string }[];
  repository_url: string;
  number: number;
}

interface OrgPRsResponse {
  org: string;
  username: string;
  totalPRs: number;
  pullRequests: PullRequest[];
  fetchedAt: string;
  pagination: {
    page: number;
    perPage: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// Organization descriptions and contributions
const ORG_INFO: Record<
  string,
  {
    name: string;
    description: string;
    myContributions: string;
    website?: string;
    colors: {
      primary: string;
      secondary: string;
    };
  }
> = {
  bitcoin: {
    name: "Bitcoin Core",
    description:
      "Bitcoin Core is the reference implementation of the Bitcoin protocol. It's the most widely used Bitcoin software and serves as the backbone of the Bitcoin network.",
    myContributions:
      "I contribute to Bitcoin Core by working on protocol improvements, bug fixes, and performance optimizations. My focus areas include wallet functionality, RPC improvements, and testing infrastructure to ensure the network remains secure and efficient.",
    website: "https://bitcoincore.org",
    colors: {
      primary: "#F7931A",
      secondary: "#FFD700",
    },
  },
  lightningnetwork: {
    name: "Lightning Network",
    description:
      "The Lightning Network is a layer-2 scaling solution for Bitcoin that enables fast, low-cost transactions through payment channels.",
    myContributions:
      "I work on Lightning Network implementations focusing on channel management, routing optimizations, and interoperability between different Lightning implementations. My contributions help improve the user experience and network reliability.",
    website: "https://lightning.network",
    colors: {
      primary: "#9146FF",
      secondary: "#FFD700",
    },
  },
  microsoft: {
    name: "Microsoft",
    description:
      "Microsoft Corporation is a multinational technology company developing, manufacturing, licensing, supporting, and selling computer software, consumer electronics, and personal computers.",
    myContributions:
      "At Microsoft, I contribute to open-source projects including developer tools, cloud services, and blockchain-related initiatives. I focus on improving developer experience and building tools that help the broader community.",
    website: "https://microsoft.com",
    colors: {
      primary: "#0078D4",
      secondary: "#FFD700",
    },
  },
  // Add more organizations as needed
};

const fetcher = (url: string) =>
  fetch(url, { cache: "no-store" }).then((r) => r.json());

function getPRStatus(pr: PullRequest) {
  if (pr.merged_at) {
    return { label: "Merged", color: "#8957e5", bgColor: "#8957e520" };
  }
  if (pr.draft) {
    return { label: "Draft", color: "#6b7280", bgColor: "#6b728020" };
  }
  if (pr.state === "open") {
    return { label: "Open", color: "#3fb950", bgColor: "#3fb95020" };
  }
  return { label: "Unknown", color: "#6b7280", bgColor: "#6b728020" };
}

function getOrgInfo(orgName: string) {
  return (
    ORG_INFO[orgName.toLowerCase()] || {
      name: orgName,
      description: `${orgName} is an organization where I contribute to various open-source projects and initiatives.`,
      myContributions: `I contribute to ${orgName} by working on various projects, fixing bugs, implementing new features, and helping improve the overall codebase quality.`,
      colors: {
        primary: "#F7931A",
        secondary: "#FFD700",
      },
    }
  );
}

export function OrganizationProfile({ orgName }: { orgName: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [allPRs, setAllPRs] = useState<PullRequest[]>([]);
  const [totalPRsCount, setTotalPRsCount] = useState<number>(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [prFilter, setPrFilter] = useState<"all" | "merged" | "open" | "draft">(
    "all"
  );

  const { data, error, isLoading } = useSWR<OrgPRsResponse>(
    `/api/org-prs?org=${encodeURIComponent(orgName)}&page=${currentPage}`,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 300000, // Auto-refresh every 5 minutes
      dedupingInterval: 120000, // Dedupe requests within 2 minutes
      focusThrottleInterval: 60000, // Throttle focus revalidation to 1 minute
      revalidateOnReconnect: true,
    }
  );

  // Accumulate PRs from all pages
  useEffect(() => {
    if (data?.pullRequests) {
      if (currentPage === 1) {
        setAllPRs(data.pullRequests);
        setTotalPRsCount(data.totalPRs); // Store total from first page
      } else {
        setAllPRs((prev) => [...prev, ...data.pullRequests]);
      }
      setIsLoadingMore(false);
      setButtonClicked(false);
    }
  }, [data, currentPage]);

  // Load more function
  const loadMore = useCallback(() => {
    if (
      data?.pagination.hasMore &&
      !isLoading &&
      !isLoadingMore &&
      !buttonClicked
    ) {
      setButtonClicked(true);
      setIsLoadingMore(true);
      setCurrentPage((prev) => prev + 1);
    }
  }, [data?.pagination.hasMore, isLoading, isLoadingMore, buttonClicked]);

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight
      )
        return;
      loadMore();
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMore]);

  const orgInfo = getOrgInfo(orgName);

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/open-source">
            <Button
              variant="outline"
              size="sm"
              className="border-border hover:border-[#F7931A] hover:text-[#F7931A] hover:bg-[#F7931A]/10 transition-all"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <div className="text-destructive">
          Failed to load PR data: {String(error)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Link href="/open-source">
          <Button
            variant="outline"
            size="sm"
            className="border-border hover:border-[#F7931A] hover:text-[#F7931A] hover:bg-[#F7931A]/10 transition-all"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Organization Header */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
            style={{ backgroundColor: orgInfo.colors.primary }}
          >
            {orgInfo.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-4xl font-bold">{orgInfo.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary">Open Source Contributor</Badge>
              {orgInfo.website && (
                <a
                  href={orgInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Organization Description */}
        <Card>
          <CardHeader>
            <CardTitle>About {orgInfo.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{orgInfo.description}</p>
            <div>
              <h4 className="font-semibold mb-2">My Contributions</h4>
              <p className="text-muted-foreground">{orgInfo.myContributions}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PR Stats */}
      {data && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Total PRs</CardTitle>
              <CardDescription>in getAlby</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">
                {totalPRsCount || data?.totalPRs || 0}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Organization</CardTitle>
              <CardDescription>Contributing to</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{data.org}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                Status
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </CardTitle>
              <CardDescription>Live feed active</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-green-600">Active</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* PR Feed */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 mb-2">
                <GitPullRequest className="h-5 w-5" />
                Pull Request Feed
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Live
                </div>
              </CardTitle>
              <CardDescription>
                Recent pull requests in {orgInfo.name} •
                {prFilter === "all"
                  ? " All PRs"
                  : prFilter === "merged"
                  ? " Merged PRs"
                  : prFilter === "open"
                  ? " Open PRs"
                  : " Draft PRs"}{" "}
                • Click to view on GitHub
              </CardDescription>
            </div>
            <Select
              value={prFilter}
              onValueChange={(value: any) => setPrFilter(value)}
            >
              <SelectTrigger className="w-[140px] border-[#F7931A]/30 hover:border-[#F7931A]">
                <Filter className="h-4 w-4 mr-2 text-[#F7931A]" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All PRs</SelectItem>
                <SelectItem value="merged">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#8957e5]"></span>
                    Merged
                  </span>
                </SelectItem>
                <SelectItem value="open">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#3fb950]"></span>
                    Open
                  </span>
                </SelectItem>
                <SelectItem value="draft">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#6b7280]"></span>
                    Draft
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && currentPage === 1 ? (
            <div className="text-muted-foreground">
              Loading pull requests...
            </div>
          ) : allPRs.length > 0 ? (
            <div className="space-y-3">
              {allPRs
                .filter((pr) => {
                  if (prFilter === "all") return true;
                  if (prFilter === "merged") return pr.merged_at;
                  if (prFilter === "open")
                    return pr.state === "open" && !pr.draft;
                  if (prFilter === "draft") return pr.draft;
                  return true;
                })
                .map((pr) => (
                  <a
                    key={`${pr.repository_url}-${pr.number}`}
                    href={pr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary hover:shadow-md hover:scale-[1.02]"
                    style={{
                      background: `linear-gradient(135deg, transparent 0%, ${orgInfo.colors.primary}08 100%)`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <GitPullRequest
                            className="h-4 w-4"
                            style={{ color: getPRStatus(pr).color }}
                          />
                          <span className="text-sm text-muted-foreground">
                            #{pr.number}
                          </span>
                          <Badge
                            variant="secondary"
                            className="text-xs"
                            style={{
                              backgroundColor: getPRStatus(pr).bgColor,
                              color: getPRStatus(pr).color,
                            }}
                          >
                            {getPRStatus(pr).label}
                          </Badge>
                        </div>
                        <h3 className="font-semibold group-hover:text-primary transition-colors truncate">
                          {pr.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(pr.created_at).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {pr.repository_url.split("/").slice(-2).join("/")}
                          </div>
                        </div>
                        {pr.labels.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {pr.labels.slice(0, 3).map((label) => (
                              <Badge
                                key={label.name}
                                variant="outline"
                                className="text-xs"
                                style={{
                                  borderColor: `#${label.color}`,
                                  color: `#${label.color}`,
                                }}
                              >
                                {label.name}
                              </Badge>
                            ))}
                            {pr.labels.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{pr.labels.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                    </div>
                  </a>
                ))}

              {/* Load more section */}
              {data?.pagination.hasMore && (
                <div className="text-center pt-4">
                  {isLoadingMore || buttonClicked ? (
                    <div className="flex items-center justify-center gap-2 py-2 px-4 text-[#F7931A]">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="text-sm font-medium">
                        Loading more PRs...
                      </span>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={loadMore}
                      className="bg-[#F7931A]/10 border-[#F7931A]/20 hover:bg-[#F7931A]/20"
                    >
                      Load More PRs
                    </Button>
                  )}
                </div>
              )}

              {/* Progress indicator */}
              {totalPRsCount > 0 && allPRs.length > 0 && (
                <div className="text-center pt-2 text-sm text-muted-foreground">
                  Showing {allPRs.length} of {totalPRsCount} pull requests
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No pull requests found for {orgInfo.name}
            </div>
          )}
        </CardContent>
      </Card>

      {data && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Last Updated: {new Date(data.fetchedAt).toLocaleString()}</span>
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            Auto-refreshing every 5 minutes
          </span>
        </div>
      )}
    </div>
  );
}
