<?php

namespace App\Repositories;


use Illuminate\Support\Facades\DB;

class CommonRepository
{

    public static function datatablesServerSide( $input, $columns, $query, $search_in = null ): array
    {
        $order = $columns;
        if ($search_in === null) {
            $search_in_columns = $order;
        } else {
            $search_in_columns = $search_in;
        }
        $dt = new ReusableServerSideTableRepository();

        if (gettype($query) == "object") {
            $dt->setQueryWithQueryBuilder($query);
        } else {
            $dt->setQueryWithSql($query);
        }
        $dt->setColumnOrder($order);
        $dt->setDraw($input['page']);
        $dt->setStart($input['page'] * $input['size']);

        $dt->setLength($input['size']);

        if (!empty($input['sort'])) {
            $sort_explode = explode(',', $input['sort']);
        } else {
            $sort_explode = [array_key_first($columns), 'ASC'];
        }

        $dt->setOrderByColumn($sort_explode[0]);

        $dt->setOrderByOrder($sort_explode[1] ?? 'ASC');

        $dt->setSearchValue($input['filter']);
        $dt->setSearchInColumns($search_in_columns);
        return $dt->getData();
    }

}
