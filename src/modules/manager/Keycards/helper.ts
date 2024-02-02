export const getColumns = (mdBreakPoint: boolean) => {
  return [
    ...(!mdBreakPoint
      ? [
          {
            name: 'id',
            label: '',
            options: {
              filter: false,
              sort: false,
              display: true,
            },
          },
        ]
      : []),
    {
      name: 'name',
      label: 'NAME',
      options: {
        filter: false,
        sort: false,
        display: true,
      },
    },
    {
      name: 'tier',
      label: 'TIER',
      options: {
        filter: false,
        sort: false,
        display: true,
      },
    },
    {
      name: 'status',
      label: 'STATUS',
      options: {
        filter: true,
        sort: true,
        display: true,
      },
    },
    {
      name: 'bestBid',
      label: 'BEST BID',
      options: {
        filter: true,
        sort: true,
        display: true,
      },
    },
    {
      name: 'date',
      label: 'DATE/TIME',
      options: {
        filter: true,
        sort: true,
        display: true,
      },
    },
    ...(!mdBreakPoint
      ? [
          {
            name: 'action',
            label: '',
            options: {
              filter: false,
              sort: false,
              display: true,
            },
          },
        ]
      : []),
  ];
};
