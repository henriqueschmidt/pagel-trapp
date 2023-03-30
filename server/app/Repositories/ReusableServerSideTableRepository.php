<?php

namespace App\Repositories;


use Illuminate\Support\Facades\DB;

class ReusableServerSideTableRepository
{

    private $queryBuilder;
    private array $searchInColumns;
    private array $orderColumn;
    private $searchTerm;
    private int $totalCount;
    private string $orderByColumn;
    private string $orderByOrder;
    private int $length;
    private int $start;
    private int $countAfterFilter;

    public function __construct() {
        $this->draw = 0;
        $this->start = 0;
        $this->totalCount = 0;
        $this->orderColumn = [];
        $this->orderByOrder = 'asc';
        $this->searchInColumns = [];
        $this->countAfterFilter = 0;
    }

    public function setQueryWithSql($sql) {
        $query = DB::table( DB::raw("( {$sql} ) as sub"));
        $this->queryBuilder = $query;
        $this->totalCount = $query->get()->count();
    }

    public function setQueryWithQueryBuilder($queryBuilder) {
        $this->queryBuilder = $queryBuilder;
        $this->totalCount = $queryBuilder->get()->count();
    }

    public function setSearchInColumns($columns) {
        $this->searchInColumns = $columns;
    }

    public function setColumnOrder($columns)
    {
        $this->orderColumn = $columns;
    }

    public function setSearchValue($value)
    {
        $value = str_replace(" ", "%", $value);
        $this->searchTerm = $value;
    }

    public function setLength($length)
    {
        $this->length = $length;
    }

    public function setDraw($draw)
    {
        $this->draw = $draw;
    }

    public function setStart($start)
    {
        $this->start = $start;
    }

    public function setOrderByColumn($column)
    {
        if (empty($this->orderColumn)) {
            throw new Exception('Set array order first than ordered column');
        }
        $this->orderByColumn = $this->orderColumn[$column];
    }

    public function setOrderByOrder($order)
    {
        $this->orderByOrder = $order;
    }

    private function filterBySearchTerm($query) {
        $search_value = '%' . $this->searchTerm . '%';
        $query = $query->where(function ($q) use ( $search_value ) {
            foreach ($this->searchInColumns as $key => $column) {
                if ($key == 0) {
                    $q->where($column, 'like',  $search_value);
                } else {
                    $q->orWhere($column, 'like',  $search_value);
                }
            }
        });
        $this->countAfterFilter = $query->get()->count();
        return $query;
    }

    private function order($query) {
        $query = $query->orderBy($this->orderByColumn ?? 0, $this->orderByOrder ?? 'asc');
        if ($this->length != -1) {
            $query = $query->offset($this->start);
            $query = $query->limit($this->length);
        }
        return $query;
    }

    public function getData(): array
    {
        $query = $this->queryBuilder;

        $query = $this->filterBySearchTerm($query);

        $query = $this->order($query);

        return [
            "draw" => $this->draw,
            "data" => $query->get()->toArray(),
            "elementsFiltered" => $this->countAfterFilter ?? $this->totalCount,
            "totalElements" => $this->totalCount,
            "success" => true,
        ];
    }

}
