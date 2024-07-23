export const getSharedData = (user) => ({
  header: user.preferred_name || user.first_name,
  personalInfo: {
    email: user.email,
    phone: '+1234567890',
    address: '123 Main Street, Vancouver, BC',
  },
  education: [
    'Ph.D. in Computer Science, University of British Columbia, 2020',
    'M.Sc. in Computer Science, University of Toronto, 2015',
    'B.Sc. in Computer Science, University of Toronto, 2013',
  ],
  professionalExperience: [
    {
      title: 'Assistant Professor, University of British Columbia',
      period: '2021 - Present',
      responsibilities: [
        'Conduct research in the field of artificial intelligence.',
        'Teach undergraduate and graduate courses.',
        'Supervise graduate students.',
      ],
    },
    {
      title: 'Research Scientist, ABC Tech',
      period: '2016 - 2021',
      responsibilities: [
        'Developed machine learning algorithms for data analysis.',
        'Collaborated with cross-functional teams to deploy solutions.',
      ],
    },
  ],
});
