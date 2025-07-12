import site from "@/data/site.json";
import { ExternalLink, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function Projects() {
  const projects = site.projects || [];

  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-none">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-bold text-foreground mb-3">Projects</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Showcasing my work in Bitcoin, blockchain, and full-stack development
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto justify-items-center">
        {projects.map((project, index) => (
          <Card
            key={index}
            className={`group relative overflow-hidden border-border bg-card transition-all hover:border-[#F7931A]/50 hover:shadow-lg hover:shadow-[#F7931A]/10 flex flex-col h-full ${project.live ? 'cursor-pointer' : ''}`}
          >
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10" />
            )}
            <div className="relative z-0 h-full flex flex-col">
            <CardHeader>
              <CardTitle className="group-hover:text-[#F7931A] transition-colors">
                {project.title}
              </CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech, techIndex) => (
                  <Badge
                    key={techIndex}
                    variant="secondary"
                    className="bg-[#F7931A]/10 text-[#F7931A] hover:bg-[#F7931A]/20 transition-colors"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>

            <CardFooter className="gap-2 relative z-20 mt-auto">
              {project.repo && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-[#F7931A]/30 hover:border-[#F7931A] hover:bg-[#F7931A]/10"
                >
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    Code
                  </a>
                </Button>
              )}
              {project.live && (
                <Button
                  size="sm"
                  asChild
                  className="bg-[#F7931A] hover:bg-[#F7931A]/90 text-white"
                >
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Live Demo
                  </a>
                </Button>
              )}
            </CardFooter>

            {/* Bitcoin-themed accent */}
            <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-bl from-[#F7931A]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
