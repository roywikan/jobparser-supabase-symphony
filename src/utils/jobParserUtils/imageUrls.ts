export const jobImageUrls = [
  "https://roywikan.github.io/jobs-image/job.1.webp",
  "https://roywikan.github.io/jobs-image/job.2.webp",
  "https://roywikan.github.io/jobs-image/job.3.webp",
  "https://roywikan.github.io/jobs-image/job.4.webp",
  "https://roywikan.github.io/jobs-image/job.5.webp",
  "https://roywikan.github.io/jobs-image/job.6.webp",
  "https://roywikan.github.io/jobs-image/job.7.webp",
  "https://roywikan.github.io/jobs-image/job.8.webp",
  "https://roywikan.github.io/jobs-image/job.9.webp",
  "https://roywikan.github.io/jobs-image/job.10.webp",
  "https://roywikan.github.io/jobs-image/job.11.webp",
  "https://roywikan.github.io/jobs-image/job.12.webp",
  "https://roywikan.github.io/jobs-image/job.13.webp",
  "https://roywikan.github.io/jobs-image/job.14.webp",
  "https://roywikan.github.io/jobs-image/job.15.webp",
  "https://roywikan.github.io/jobs-image/job.16.webp",
  "https://roywikan.github.io/jobs-image/job.17.webp",
  "https://roywikan.github.io/jobs-image/job.18.webp",
  "https://roywikan.github.io/jobs-image/job.19.webp",
  "https://roywikan.github.io/jobs-image/job.20.webp"
];

export const getRandomJobImage = (): string => {
  const randomIndex = Math.floor(Math.random() * jobImageUrls.length);
  return jobImageUrls[randomIndex];
};