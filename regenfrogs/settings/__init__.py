# -*- coding: utf-8 -*-
from .project import *

try:
    from .local import *
except ImportError:
    pass
