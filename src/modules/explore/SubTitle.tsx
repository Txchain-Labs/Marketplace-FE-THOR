import React, { FC } from 'react';
import { Box, Typography } from '@mui/material';

interface SubTitleProps {
  title: string;
}

const SubTitle: FC<SubTitleProps> = ({ title }) => {
  return (
    <Box mb={'16px'} display={'flex'}>
      <Box
        sx={(theme) => ({
          width: '8px',
          my: '8px',
          mr: '16px',
          backgroundColor: theme.palette.primary.main,
        })}
      />
      <Typography
        variant={'sub-h'}
        sx={{
          lineHeight: '36px',
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

export default SubTitle;
