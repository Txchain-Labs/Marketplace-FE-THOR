export const getColumns = (mdBreakPoint: boolean, activeNode: string) => {
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
      name: 'condition',
      label: 'CONDITION',
      options: {
        filter: false,
        sort: false,
        display: true,
      },
    },
    {
      name: 'bost',
      label: 'BOOST',
      options: {
        filter: false,
        sort: false,
        display: true,
      },
    },
    {
      name: 'date',
      label: 'DATE',
      options: {
        filter: true,
        sort: true,
        display: true,
      },
    },
    ...(activeNode !== 'BONUS'
      ? [
          {
            name: 'dueDate',
            label: 'DUE DATE',
            options: {
              filter: true,
              sort: true,
              display: true,
            },
          },
        ]
      : []),
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
